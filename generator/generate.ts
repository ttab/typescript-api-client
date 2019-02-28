/// <reference path="global.d.ts"/>

import axios from 'axios';
import { readFileSync, writeFileSync } from 'fs';
import { camelCase, capitalize, filter, map } from 'lodash';
import * as mustache from 'mustache';
import { Swagger, SwaggerType } from 'swagger-typescript-codegen/lib/swagger/Swagger';
import { convertType } from 'swagger-typescript-codegen/lib/typescript';
import { TypeSpec } from 'swagger-typescript-codegen/lib/typespec';
import { Definition, makeDefinitionsFromSwaggerDefinitions } from 'swagger-typescript-codegen/lib/view-data/definition';
import { getParametersForMethod } from 'swagger-typescript-codegen/lib/view-data/parameter';

// this is the host we will generate api.ts for (and which will also
// be the default host in the generated api)
let apiHost = process.env.API_HOST || 'https://api.tt.se'

async function fetchSpec(): Promise<Swagger> {
  return axios({
    url: `${apiHost}/api-docs`
  }).then(({ data }) => data)
}

async function resolveExternalRefs(spec: Swagger): Promise<Swagger> {
  return Promise.all(map(spec.definitions, async (def, name) => {
    if (def.$ref && (def.$ref.startsWith('http://') || def.$ref.startsWith('https://'))) {
      return axios.get<SwaggerType>(def.$ref).then((res) => {
        let def: any = res.data
        delete def['additionalProperties']
        return { name, def }
      })
    } else {
      return Promise.resolve({ name, def })
    }
  })).then((deflist) => {
    let definitions: { [key: string]: SwaggerType } = {}
    for (let t of deflist) {
      definitions[t.name] = t.def
    }
    return {
      ...spec,
      definitions
    }
  })
}

/**
 * swagger-codegen treats all objects with additionalProperties: false
 * as if they were true, so we have to manually correct that.
 */
function fixAdditionalProperties(spec: Swagger): Swagger {

  function fixProperties(properties: { [index: string]: SwaggerType }) {
    for (let p in properties) {
      fixDefinition(properties[p])
    }
  }

  function fixDefinition(def: SwaggerType) {
    let d: any = def
    if (d.type == 'object' && d.hasOwnProperty('additionalProperties') && d['additionalProperties'] === false) {
      delete d['additionalProperties']
    }
    if (d.properties) {
      fixProperties(d.properties)
    }
    if (d['patternProperties']) {
      fixProperties(d['patternProperties'])
    }
  }

  for (let d in spec.definitions) {
    fixDefinition(spec.definitions[d])
  }

  return spec
}

let httpMethods: { [key: string]: string } = {
  'get': '',
  'put': 'update',
  'post': 'add',
  'delete': 'remove'
}

interface Endpoint {
  api: string
  className: string
  version: string
  nameParts: string[]
  formatString: string
}

interface View {
  host: string
  apis: Api[]
  definitions: Definition[]
}

interface Api {
  api: string
  className: string
  methods: Method[]
}

interface Method {
  shortName: string
  fullName: string
  httpMethod: string
  formatString: string
  pathParameters: Parameter[]
  queryParameters: Parameter[]
  bodyParameters: Parameter[]
  hasQueryParameters: boolean
  hasBodyParameters: boolean
  isSingleton: boolean
  responseType: TypeSpec
  summary: string
  description: string
}

interface Parameter {
  name: string
  type: TypeSpec
  typeName: string
  cardinality: string
}

function parsePath(path: string): Endpoint {
  let [, api, version, ...tail] = path.split('/')
  tail = tail.filter((t) => { return !t.startsWith('{') })
  return {
    api: api,
    className: capitalize(api) + capitalize(version),
    version,
    nameParts: tail,
    formatString: path.replace(/{/g, '${')
  }
}

function fullName(name: string, pathParameters: Parameter[]): string {
  return [
    name,
    ...pathParameters.map((p) => { return capitalize(p.name) })
  ].join('By')
}

function buildParameters(parameters: any = [], spec: Swagger): { [type: string]: Parameter[] } {
  let p: { [type: string]: Parameter[] } = {
    body: [],
    query: [],
    path: []
  }
  for (let o of getParametersForMethod([], parameters, spec)) {
    p[o.in].push({
      name: o.name,
      type: o.tsType,
      typeName: o.type,
      cardinality: o.cardinality
    })
  }
  return p
}

function buildDefinitions(spec: Swagger): Definition[] {
  let defs = makeDefinitionsFromSwaggerDefinitions(spec.definitions, spec)
  return defs.map((def) => {
    return {
      name: def.name,
      description: def.description,
      tsType: def.tsType
    }
  })
}

function buildView(spec: Swagger): View {
  let apis: { [key: string]: Api } = {}
  for (let [path, obj] of Object.entries(spec.paths)) {
    let e = parsePath(path)
    if (!apis[e.api]) {
      apis[e.api] = {
        api: e.api,
        className: e.className,
        methods: []
      }
    }
    let api: Api = apis[e.api]
    for (let [httpMethod, method] of Object.entries(obj)) {
      if (!httpMethod.startsWith('x-')) {
        let name = camelCase([httpMethods[httpMethod], ...e.nameParts].join(' '))
        let parameters = buildParameters(method.parameters, spec)

        // check if there are other methods with the same shortName
        let lookalikes = filter(api.methods, { shortName: name })
        for (let m of lookalikes) {
          m.isSingleton = false
        }

        api.methods.push({
          shortName: name,
          summary: method.summary,
          description: method.description,
          fullName: fullName(name, parameters.path),
          pathParameters: parameters.path,
          queryParameters: parameters.query,
          bodyParameters: parameters.body,
          formatString: e.formatString,
          httpMethod: httpMethod,
          hasQueryParameters: parameters.query.length > 0,
          hasBodyParameters: parameters.body.length > 0,
          isSingleton: lookalikes.length == 0,
          responseType: convertType(method.responses['200'], spec)
        })
      }
    }
  }
  return {
    host: apiHost,
    apis: Object.values(apis),
    definitions: buildDefinitions(spec)
  }
}

function render(view: any): void {
  writeFileSync('./api.ts',
    mustache.render(
      readFileSync('./generator/templates/class.mustache').toString(),
      view,
      {
        type: readFileSync('./generator/templates/type.mustache').toString()
      }
    ))
}

// do the thing
fetchSpec()
  .then(resolveExternalRefs)
  .then(fixAdditionalProperties)
  .then(buildView)
  .then(render)
  .catch(console.error)
