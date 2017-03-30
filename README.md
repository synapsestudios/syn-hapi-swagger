# syn-hapi-swagger
Custom wrappers for allowing hapi-swaggered and the swagger-ui to work with our hapi-template and OIDC

## Hapi Plugin
The hapi plug adds an endpoint to fetch a specification for your api that is compliant with Swagger 2.0. The Synapse plugin is a wrapper around the hapi-swaggered package that includes security definitions, and OIDC token-fetch endpoint, and a workaround for our mixedValidation helper for asynchronous validation functions.
### Configuration
The plugin allows the following options:
* `oidcClientId`: The client id to use when converting an access code to an authorization token. If this is not provided, then the token endpoint will not be made available.
* `oidcClientSecret`: The client secret to use when converting an access code to an authorization token. If this is not provided, then the token endpoint will not be made available.
* `oidcHost`: The public-facing host of the OIDC service (default: https://localhost:7000)
* `oidcInternalHost`: The internal host of the OIDC service (default: http://oidc:9000)
* `oidcTokenPath`: The path for the token endpoint on the OIDC server (default: /op/token)
* `tokenPath`: The path for the endpoint to create, which returns an authorization token when provided an access code (default: /swagger-token)
The plugin also passes these options directly through to the hapi-swaggered plugin:
* `requiredTags`: an array of strings, only routes with all of the specified tags will be exposed, defaults to: `['api']`
* `produces`: an array of mime type strings, defaults to: `[ 'application/json' ]`
* `consumes`: an array of mime type strings, defaults to: `[ 'application/json' ]`
* `endpoint`: route path to the swagger specification, defaults to: `'/swagger'`
* `routeTags`: an array of strings, all routes exposed by hapi-swaggered will be tagged as specified, defaults to `['swagger']`
* `stripPrefix`: a path prefix which should be stripped from the swagger specifications. E.g. your root resource are located under `/api/v12345678/resource` you might want to strip `/api/v12345678`, defaults to null
* `basePath`: string, optional url base path (e.g. used to fix reverse proxy routes) (defaut: /)
* `supportedMethods`: array of http methods, only routes with mentioned methods will be exposed, in case of a wildcard * a route will be generated for each method, defaults to `['get', 'put', 'post', 'delete', 'patch']`
* `host`: string, overwrite requests host (e.g. domain.tld:1337)
* `schemes`: array of allowed schemes e.g. `['http', 'https', 'ws', 'wss']` (optional)
* `info`: exposed swagger api informations, defaults to null (optional)
  * `title`: string (required)
  * `description`: string (required)
  * `termsOfService`: string
  * `contact`: object (optional)
    * `name`: string
    * `url`: string
    * `email`: string
  * `license`: object  (optional)
    * `name`: string: string
    * `url`: string: string
  * `version`: version string of your api, which will be exposed (required)
* `tagging`: Options used for grouping routes
  * `mode`: string, can be `path` (routes will be grouped by its path) or `tags` (routes will be grouped by its tags), default is `path`
  * `pathLevel` integer, in case of mode `path` it defines on which level the path grouping will take place (default is 1)
  * `stripRequiredTags` boolean, in case of mode `tags` it defines if the `requiredTags` will not be exposed (default is true)
* `tags`: object (or array with objects according to the [swagger specs](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#tagObject)) for defining tag / group descriptions. E.g. you two endpoints `/get/this` and `/get/that` and the tagging mode is set to path (with pathLevel: 1) they will be groupped unter /get and you are able to define a description through this object as `{ 'get': 'get this and that' }`, defaults to null
* `cors`: boolean or object with cors configuration as according to the [hapijs documentation](https://github.com/hapijs/hapi/blob/master/API.md#route-options) (defaults to false)
* `cache`: caching options for the swagger schema generation as specified in [`server.method()`](https://github.com/hapijs/hapi/blob/master/API.md#servermethodname-method-options) of hapi, defaults to: `{ expiresIn: 15 * 60 * 1000 }`
* `responseValidation`: boolean, turn response validation on and off for hapi-swaggered routes, defaults to false
* `auth`: authentication configuration [hapijs documentation](https://github.com/hapijs/hapi/blob/master/API.md#route-options) (default to undefined)
