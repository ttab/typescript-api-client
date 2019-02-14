/// <reference path="global.d.ts"/>

import axios from 'axios';
import { readFileSync } from 'fs';
import { camelCase, capitalize, filter } from 'lodash';
import * as mustache from 'mustache';
import * as SwaggerTools from 'swagger-tools';
import { convertType } from 'swagger-typescript-codegen/lib/typescript'
import { makeDefinitionsFromSwaggerDefinitions, Definition } from 'swagger-typescript-codegen/lib/view-data/definition'
import { getSuccessfulResponseType } from 'swagger-typescript-codegen/lib/view-data/responseType'
import { TypeSpec } from 'swagger-typescript-codegen/lib/typespec';
import { Swagger } from 'swagger-typescript-codegen/lib/swagger/Swagger'

async function fetchSpec(): Promise<any> {
  return axios({
    url: 'http://localhost:3100/api-docs'
  }).then(({ data }) => data)
}

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
  for (let o of parameters) {
    p[o['in']].push({
      name: o['name'],
      type: convertType(o, spec),
      cardinality: o['required'] ? '' : '?'
    })
  }
  return p
}

function buildDefinitions(spec: Swagger): Definition[] {
  let defs = makeDefinitionsFromSwaggerDefinitions(spec.definitions, spec)
  return defs.map((def) => {
    return {
      name: capitalize(camelCase(def.name)),
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
    for (let [method, details] of Object.entries(obj)) {
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
  .then(resolveSpec)
  .then(buildView)
  .then(render)
  .then(console.log)
  .catch(console.error)
