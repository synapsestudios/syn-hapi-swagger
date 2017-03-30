const _ = require('lodash');
const Hoek = require('hoek');
const hapiSwaggered = require('hapi-swaggered');
const PKG = require('./package');

const hapiSwaggeredOptions = [
  'requiredTags',
  'produces',
  'consumes',
  'endpoint',
  'routeTage',
  'stripPrefix',
  'basePath',
  'supportedMethods',
  'host',
  'schemes',
  'info',
  'tagging',
  'tags',
  'cors',
  'cache',
  'responseValidation',
  'auth',
];

const optionDefaults = {
  basePath: '/',
  endpoint: '/swagger',
  oidcHost: 'https://localhost:7000',
  oidcInternalHost: 'http://oidc:9000',
  oidcTokenPath: '/op/token',
  tokenPath: '/swagger-token',
};

const register = function(plugin, options, next) {
  const config = Hoek.applyToDefaults(optionDefaults, options);
  new Promise((resolve, reject) => {
    const filteredOptions = _.pick(config, hapiSwaggeredOptions);
    hapiSwaggered.register(server, filteredOptions, resolve);
  }).then(() => {
    addSecurityDefinitionsToApiSpec(
      plugin,
      config.endpoint,
      config.basePath,
      config.tokenPath,
      config.oidcHost
    );
    normalizeMixedValidationFunctions(
      plugin,
      config.endpoint
    );
    if (config.oidcClientId && config.oidcClientSecret) {
      addSwaggerTokenEndpoint(
        plugin,
        config.tokenPath,
        config.oidcInternalHost,
        config.oidcTokenPath,
        config.oidcClientId,
        config.oidcClientSecret
      );
    } else {
      console.log('oidcClientId and/or oidcClientSecret not provided; not including swagger-token endpoint');
    }
    next();
  });
};

register.attributes = {
  name: 'Synapse Hapi Swagger',
  version: PKG.version
};

module.exports = register;
