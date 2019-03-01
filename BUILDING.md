# Building the client

Normally, you wouldn't need to re-generate the client code, but this
is how you'd do it.

First check out the client code and install the dependencies:

    > git clone git@github.com:ttab/typescript-api-client.git
    > npm install

To re-generate the client code from the Swagger spec hosted at
http://api.tt.se/api-docs:

    > npm run generate

Alternatively, you can select a different host to fetch the spec
from. This is really only applicable for internal development use.

    > API_HOST=<host> npm run generate

To generate a client and compile typescript to javascript:

    > npm run dist

## Testing

The client has a limited suite of integration tests that's mostly
meant to check that our fundamental assumptions are correct. To run
them, you need an OAuth2 token.

    > TOKEN=<OAuth2 token> npm test
