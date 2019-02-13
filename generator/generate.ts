import axios from 'axios';
import { readFileSync } from 'fs';
import { camelCase, capitalize, filter } from 'lodash';
import * as mustache from 'mustache';
import * as Swagger from 'swagger-tools';

function fetchSpec(): Promise<any> {
  return axios({
    url: 'http://localhost:3100/api-docs'
  }).then(({ data }) => data)
}

function resolveSpec(json: any): Promise<any> {
  return new Promise((rs, rj) => {
    Swagger.specs.v2.resolve(json, (err: Error, result: any) => {
      if (err) {
        return rj(err)
      }
      rs(result)
    })
  })
}

let httpMethods = {
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
  isSingleton: boolean
}

interface Parameter {
  name: string
  type: Type
  cardinality: string
}

interface Type {
  // isBasic: boolean
  basicType: string
  // isEnum: boolean
  enumValues: string[]
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

function buildType(parameter: any): Type {
  if (parameter['type'] === 'string') {
    return {
      basicType: 'string',
      enumValues: parameter['enum']
    }
  } else {

  }
}

function buildParameters(parameters: any = []): { [type: string]: Parameter[] } {
  let p: { [type: string]: Parameter[] } = {
    body: [],
    query: [],
    path: []
  }
  for (let o of parameters) {
    p[o['in']].push({
      name: o['name'],
      type: buildType(o),
      cardinality: o['required'] ? '' : '?'
    })
  }
  return p
}

function buildView(spec: any): Root {
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
          console.error('DETAILS', details)
          let parameters = buildParameters(details.parameters)

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
            isSingleton: lookalikes.length == 0
          })
        }
      }
    }
  }
  return { apis: Object.values(apis) }
}

function render(view: any): string {
  // console.error(JSON.stringify(view, null, 2))
  return mustache.render(
    readFileSync('./generator/templates/class.mustache').toString(),
    view
  )
}

// do the thing
fetchSpec()
  .then(resolveSpec)
  .then(buildView)
  .then(render)
  .then(console.log)
  .catch(console.error)
