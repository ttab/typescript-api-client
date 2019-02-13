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
    })
  }
}
