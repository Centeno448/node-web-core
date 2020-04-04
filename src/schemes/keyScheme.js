const ApiConfig = require('../apiConfig');
const Boom = require('@hapi/boom');

module.exports = {
  implementation: function (server, options) {
    const scheme = {
      authenticate: async function (request, h) {
        if (!request.headers.auth) {
          throw Boom.unauthorized('NOT_VALID');
        }

        const key = request.headers.auth;

        if (key !== ApiConfig.securityKey) {
          throw Boom.unauthorized('NOT_VALID');
        }

        credentials = { key: key };

        return h.authenticated({ credentials });
      },
    };

    return scheme;
  },
};
