const missingJoiSchemaMsg = 'Encountered a validation function without a joiSchema attribute. When using swagger docs, any validation functions must include an joiSchema attribute that contains a joi Schema describing the expected shape of the data.';

/*
  Monkey-patch the function that fetches all routes for the current connection
  to step through those routes and replace any validation functions with a joi
  schema, assuming that those functions have a joiSchema attribute (an error is
  thrown otherwise).
*/
module.exports = function(
  plugin,
  specPath
) {
  plugin.ext({
    type: 'onPreHandler',
    method: (request, reply) => {
      if (request.path === specPath) {
        var originalTableFunction = request.connection.table;
        request.connection.table = function() {
          var routes = originalTableFunction.apply(this, arguments);
          routes.forEach(route => {
            var routeValidation = route.public.settings.validate;

            if (typeof(routeValidation.headers) === 'function' && routeValidation.headers.joiSchema)  {
              routeValidation.headers = Joi.object().keys(
                routeValidation.headers.joiSchema
              );
            } else if (typeof(routeValidation.headers) === 'function') {
              throw new Error(missingJoiSchemaMsg);
            }

            if (typeof(routeValidation.params) === 'function' && routeValidation.params.joiSchema)  {
              routeValidation.params = Joi.object().keys(
                routeValidation.params.joiSchema
              );
            } else if (typeof(routeValidation.headers) === 'function') {
              throw new Error(missingJoiSchemaMsg);
            }

            if (typeof(routeValidation.query) === 'function' && routeValidation.query.joiSchema)  {
              routeValidation.query = Joi.object().keys(
                routeValidation.query.joiSchema
              );
            } else if (typeof(routeValidation.headers) === 'function') {
              throw new Error(missingJoiSchemaMsg);
            }

            if (typeof(routeValidation.payload) === 'function' && routeValidation.payload.joiSchema)  {
              routeValidation.payload = Joi.object().keys(
                routeValidation.payload.joiSchema
              );
            } else if (typeof(routeValidation.headers) === 'function') {
              throw new Error(missingJoiSchemaMsg);
            }
          });
          return routes;
        };
        request.connection.table.restore = function() {
          request.connection.table = originalFunction;
        };
      }
      reply.continue();
    },
    options: {
      sandbox: 'plugin'
    }
  });

  plugin.ext({
    type: 'onPostHandler',
    method: (request, reply) => {
      if (typeof(request.connection.table.restore) === 'function') {
        request.connection.table.restore();
      }
      reply.continue();
    },
    options: {
      sandbox: 'plugin'
    }
  });
};
