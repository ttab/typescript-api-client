import axios from 'axios'
import debug from 'debug'
import * as EventEmitter from 'eventemitter3'
import StrictEventEmitter from 'strict-event-emitter-types'

import { Api, ttninjs } from '../api'

let log = debug('tt:api')

export interface ApiOptions {
  token: string
  host: string
}

class ApiError extends Error {
  statusCode: number = 0
}

export class ApiBase {
  token: string
  host: string

  constructor(options: ApiOptions) {
    this.token = options.token
    this.host = options.host
  }

  async call(
    httpMethod: string,
    path: string,
    query?: {},
    body?: {}
  ) {
    let url = this.host + path
    log(httpMethod, url, query, body)
    return axios({
      method: httpMethod,
      url: url,
      params: query,
      data: body,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    }).then((res: any) => {
      return res.data
    }).catch((err: any) => {
      if (err.response) {
        let e: ApiError
        if (typeof err.response.data === 'object') {
          e = new ApiError(err.response.data.message)
          // for (let prop of Object.entries(err.response.data)) {
          //   if (prop[0] !== 'message') {
          //     e[prop[0]] = prop[1]
          //   }
          // }
        } else {
          e = new ApiError(err.response.data)
        }
        e.statusCode = err.response.status
        throw e
      }
      throw err
    })
  }
}

interface ContentStreamEvents {
  data: (hit: ttninjs) => void
  error: (error: ApiError) => void
  close: void
}

export class ContentStream extends (EventEmitter as { new(): StrictEventEmitter<EventEmitter, ContentStreamEvents> })
{
  running: boolean = true

  constructor(
    api: Api,
    mediaType:
      | "_all"
      | "image"
      | "video"
      | "graphic"
      | "text"
      | "feature"
      | "page"
      | "planning"
      | "calendar",
    parameters: {
      q?: string;
      p?: Array<string>;
      agr?: Array<number>;
      last?: string;
      wait?: number;
    }) {
    super()

    let last: string | undefined = undefined
    this.run = () => {
      api.content.stream(mediaType, { ...parameters, last }).then(res => {
        res.hits.forEach(hit => {
          this.emit('data', hit)
          last = hit.uri
        })
      }).catch(err => {
        this.emit('error', err)
      }).then(() => {
        if (this.running) {
          this.run()
        } else {
          this.emit('close')
        }
      })
    }
    this.run()
  }

  run: () => void

  stop() {
    this.running = false
  }

}
