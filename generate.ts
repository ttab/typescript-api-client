import { readFileSync } from 'fs'
import axios from 'axios'
import * as Swagger from 'swagger-tools'
import { camelCase } from 'lodash'


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
  version: string
  nameParts: string[]
  formatString: string
}

function parsePath(path: string): Endpoint {
  let [, api, version, ...tail] = path.split('/')
  tail = tail.filter((t) => { return !t.startsWith('{') })
  return {
    api,
    version,
    nameParts: tail,
    formatString: path.replace(/{/g, '${parameters.')
  }
}

function buildView(spec: any): any {
  var apis = {}

  for (let [path, obj] of Object.entries(spec.paths)) {
    let e = parsePath(path)
    if (!apis[e.api]) {
      apis[e.api] = []
    }
    for (let [method, details] of Object.entries(obj)) {
      if (!method.startsWith('x-')) {
        let name = camelCase([httpMethods[method], ...e.nameParts].join(' '))
        console.log(details)
        apis[e.api].push({
          name: name,
          parameters: details.parameters,
          formatString: e.formatString,
          method: method
        })
      }
    }
  }

  return apis
}


fetchSpec()
  .then(resolveSpec)
  .then(buildView)
  .then(console.log)
  // .then((s) => {
  //   console.log(JSON.stringify(s, null, 2))
  // })
  .catch(console.error)
