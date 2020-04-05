const Boom = require('@hapi/boom');
const ApiConfig = require('../apiConfig');
const JWT = require('jsonwebtoken');

module.exports = {
  implementation: function (server, options) {
    const scheme = {
      authenticate: async function (request, h) {
        const auth = request.headers.authorization;

        if (!auth) {
          throw Boom.unauthorized();
        }

        const token = auth.split(' ')[1];

        const user = JWT.verify(
          token,
          ApiConfig.accessTokenSecret,
          (error, user) => {
            if (error) {
              throw Boom.unauthorized();
            }

            return user;
          }
        );

        credentials = { user };

        return h.authenticated({ credentials });
      }
    };

    return scheme;
  }
};
