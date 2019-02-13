import { readFileSync, writeFileSync } from 'fs'
import axios from 'axios'
import * as Swagger from 'swagger-tools'
import { camelCase, capitalize } from 'lodash'
import * as mustache from 'mustache'

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
}

interface Parameter {
  name: string
  type: string
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
    formatString: path.replace(/{/g, '${parameters.')
  }
}

function buildView(spec: any): any {
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
        if (name === 'profile') {
          console.error('DETAILS', details)
          api.methods.push({
            shortName: name,
            fullName: name,
            pathParameters: [],
            queryParameters: details.parameters,
            bodyParameters: [],
            formatString: e.formatString,
            httpMethod: method
          })
        }
      }
    }
  }
  return { apis: Object.values(apis) }
}

function render(view: any): string {
  console.error(JSON.stringify(view, null, 2))
  return mustache.render(
    readFileSync('./templates/class.mustache').toString(),
    view
  )
}


fetchSpec()
  .then(resolveSpec)
  .then(buildView)
  .then(render)
  .then(console.log)
  // .then((s) => {
  //   console.log(JSON.stringify(s, null, 2))
  // })
  .catch(console.error)
