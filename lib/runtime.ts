import axios from 'axios'

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
    return axios({
      method: httpMethod,
      url: this.host + path,
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
