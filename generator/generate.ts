/// <reference path="global.d.ts"/>

import axios from 'axios';
import { readFileSync } from 'fs';
import { camelCase, capitalize, filter, map } from 'lodash';
import * as mustache from 'mustache';
import * as SwaggerTools from 'swagger-tools';
import { Swagger, SwaggerType } from 'swagger-typescript-codegen/lib/swagger/Swagger';
import { convertType } from 'swagger-typescript-codegen/lib/typescript';
import { TypeSpec } from 'swagger-typescript-codegen/lib/typespec';
import { Definition, makeDefinitionsFromSwaggerDefinitions } from 'swagger-typescript-codegen/lib/view-data/definition';
import { getParametersForMethod } from 'swagger-typescript-codegen/lib/view-data/parameter';

async function fetchSpec(): Promise<Swagger> {
  return axios({
    url: 'http://localhost:3100/api-docs'
  }).then(({ data }) => data)
}

/**
 * Let swagger-tools resolve any external references in the spec.
 */
function resolveSpec(json: any): Promise<Swagger> {
  return new Promise((rs, rj) => {
    SwaggerTools.specs.v2.resolve(json, (err, result) => {
      if (err) {
        return rj(err)
      }
      rs(result)
    })
  })
}

function resolveExternalRefs(spec: Swagger): Promise<Swagger> {
  return Promise.all(map(spec.definitions, (def, name) => {
    if (def.$ref && (def.$ref.startsWith('http://') || def.$ref.startsWith('https://'))) {
      return axios.get(def.$ref).then((res) => {
        delete res.data.additionalProperties
        return [name, res.data]
      })
    }
    else {
      return Promise.resolve([name, def])
    }
  })).then((deflist: [string, SwaggerType][]) => {
    let definitions: { [key: string]: SwaggerType } = {}
    for (let t of deflist) {
      definitions[t[0]] = t[1]
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

  function fixDefinition(d: SwaggerType) {
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

interface Root {
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
}

interface Parameter {
  name: string
  type: TypeSpec
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

function buildView(spec: Swagger): Root {
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

    for (let method in obj) {
      let details = obj[method]
      if (!method.startsWith('x-')) {

        let name = camelCase([httpMethods[method], ...e.nameParts].join(' '))
        if (name) {
          let parameters = buildParameters(details.parameters, spec)

          // check if there are other methods with the same shortName
          let lookalikes = filter(api.methods, { shortName: name })
          for (let m of lookalikes) {
            m.isSingleton = false
          }

          api.methods.push({
            shortName: name,
            fullName: fullName(name, parameters.path),
            pathParameters: parameters.path,
            queryParameters: parameters.query,
            bodyParameters: parameters.body,
            formatString: e.formatString,
            httpMethod: method,
            hasQueryParameters: parameters.query.length > 0,
            hasBodyParameters: parameters.body.length > 0,
            isSingleton: lookalikes.length == 0,
            responseType: convertType(details.responses['200'], spec)
          })
        }
      }
    }
  }
  return {
    apis: Object.values(apis),
    definitions: buildDefinitions(spec)
  }
}

function render(view: any): string {
  // console.error(JSON.stringify(view, null, 2))
  return mustache.render(
    readFileSync('./generator/templates/class.mustache').toString(),
    view,
    {
      type: readFileSync('./generator/templates/type.mustache').toString()
    }
  )
}

// do the thing
fetchSpec()
  .then(resolveExternalRefs)
  .then(fixAdditionalProperties)
  .then(buildView)
  .then(render)
  .then(console.log)
  .catch(console.error)
