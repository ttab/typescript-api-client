import axios from 'axios'

export interface ApiOptions {
  token: string
  host?: string
}

export class ApiBase {
  token: string
  host: string

  constructor(options: ApiOptions) {
    this.token = options.token
    this.host = options.host || 'http://api.tt.se'
  }

  call(
    httpMethod: string,
    path: string,
    query?: { [key: string]: string },
    body?: { [key: string]: string }
  ) {
    return axios({
      method: httpMethod,
      url: this.host + path,
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).then((res) => {
      return res.data
    }).catch((err) => {
      if (err.response) {
        let e: Error
        if (typeof err.response.data === 'object') {
          e = new Error(err.response.data.message)
          for (let prop of Object.entries(err.response.data)) {
            if (prop[0] !== 'message') {
              e[prop[0]] = prop[1]
            }
          }
        } else {
          e = new Error(err.response.data)
        }
        e['statusCode'] = err.response.status
        throw e
      }
      throw err
    })
  }
}
