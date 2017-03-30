const btoa = require('btoa');
const boom = require('boom');
const Wreck = require('wreck');

/*
  Add an endpoint that takes an access code and uses it to fetch an access token
  from OIDC
*/
module.exports = function(
  plugin,
  tokenPath,
  oidcInternalHost,
  oidcTokenPath,
  clientId,
  clientSecret
) {
  plugin.route({
    method: 'POST',
    path: tokenPath,
    config: {
      auth: false,
      cors: true
    },
    handler: (request, reply) => {
      const auth = btoa(`${clientId}:${clientSecret}`);

      Wreck.post(
        `${oidcInternalHost}${oidcTokenPath}`,
        {
          json: true,
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          payload: `code=${request.payload.code}&grant_type=${request.payload.grant_type}&redirect_uri=${request.payload.redirect_uri}`
        },
        (err, response, payload) => {
          if (err) {
            reply(boom.badImplementation(err.message));
          } else {
            reply({
              access_token: payload.id_token,
              expires_in: payload.expires_in,
            });
          }
        }
      );
    }
  })
};
