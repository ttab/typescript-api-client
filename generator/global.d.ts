
declare module 'swagger-tools' {

  import { Swagger } from 'swagger-typescript-codegen/lib/swagger/Swagger'

  export interface SpecsV2 {
    resolve(json: number, cb: (err: Error, result: Swagger) => void): void
  }

  export interface SpecsVersions {
    v2: SpecsV2
  }

  export var specs: SpecsVersions;

}
