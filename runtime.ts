import axios, { Method } from 'axios'
import debug from 'debug'
import * as EventEmitter from 'eventemitter3'
import StrictEventEmitter from 'strict-event-emitter-types'
import { Api, ttninjs } from './api'

let log = debug('tt:api')

const BACKOFF_INITIAL_DELAY = 50
const BACKOFF_MAX_DELAY     = 1000 * 60

export interface ApiOptions {
  token?: string
  host: string
  timeout: number
}

export interface CallOptions {
  timeout?: number
}

export class ApiError extends Error {
  statusCode: number = 0
}

export class ApiBase {
  options: ApiOptions

  constructor(options: ApiOptions) {
    this.options = options
  }

  async call(
    httpMethod: Method,
    path: string,
    query?: {},
    body?: {},
    opts?: CallOptions
  ) {
    let url = this.options.host + path
    let timeout = opts ? opts.timeout ? opts.timeout : this.options.timeout : this.options.timeout
    let headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (this.options.token) {
      headers['Authorization'] = `Bearer ${this.options.token}`
    }
    log(httpMethod, url, query, body, {timeout})
    return axios({
      method: httpMethod,
      url: url,
      params: query,
      data: body,
      headers,
      timeout
    }).then((res: any) => {
      return res.data
    }).catch((err: any) => {
      if (err.response) {
        let e: ApiError
        if (typeof err.response.data === 'object') {
          e = new ApiError(err.response.data.message)
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
  backoff: number = 0

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

    let last: string | undefined = parameters.last
    this.run = () => {
      api.content.stream(mediaType, { ...parameters, last }).then(res => {
        res.hits.forEach(hit => {
          this.emit('data', hit)
          last = hit.uri
        })
      }).then(() => {
        // reset backoff, since this operation succeeded
        this.backoff = 0
      }).catch(err => {
        this.emit('error', err)
        if (err instanceof ApiError) {
          if (err.statusCode.toString().startsWith('4')) {
            this.running = false
          }
        }
        // calculate new backoff delay
        if (this.backoff === 0) {
          this.backoff = BACKOFF_INITIAL_DELAY
        } else {
          this.backoff = Math.min(this.backoff * 2, BACKOFF_MAX_DELAY)
        }
      }).then(() => {
        if (this.running) {
          setTimeout(this.run, this.backoff)
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
