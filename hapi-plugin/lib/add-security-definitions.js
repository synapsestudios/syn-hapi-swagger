/*
  Add a function that adds the jwt security definition to the response
  when a request is made to fetch the Open API spec.
*/
module.exports = function(
  plugin,
  specPath,
  apiBasePath,
  tokenPath,
  oidcHost
) {
  const jwtSecurityDefinition = {
    "type": "oauth2",
    "flow": "accessCode",
    "authorizationUrl": `${oidcHost}/op/auth`,
    "tokenUrl": `${apiBasePath}${tokenPath}`,
    "scopes": {
      "email": "User's email",
      "openid": "User's Identity"
    }
  };

  plugin.ext({
    type: 'onPostHandler',
    method: (request, reply) => {
      if (request.response.source && request.path === specPath) {
        request.response.source.securityDefinitions = {
          "jwt": jwtSecurityDefinition
        };
      }
      reply.continue();
    },
    options: {
      sandbox: 'plugin'
    }
  });
};
