require('dotenv').config();
const Hapi = require('@hapi/hapi');
const JWTScheme = require('./schemes/jwtScheme');
const KeyScheme = require('./schemes/keyScheme');
const AppRoutes = require('./routes/appRoutes');

const start = async () => {
  const server = Hapi.server({
    host: 'localhost',
    port: 4000,
    routes: {
      cors: {
        origin: ['http://localhost:4200'],
        headers: [
          'Access-Control-Allow-Headers',
          'Access-Control-Allow-Origin',
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language'
        ],
        additionalHeaders: [
          'Access-Control-Allow-Headers: Origin, Content-Type, x-ms-request-id , Authorization',
          'Auth'
        ],
        credentials: true
      }
    }
  });

  // Registers JWT auth scheme
  server.auth.scheme('jwtScheme', JWTScheme.implementation);
  server.auth.strategy('jwt', 'jwtScheme');

  // Registers API Key auth scheme
  server.auth.scheme('keyScheme', KeyScheme.implementation);
  server.auth.strategy('key', 'keyScheme');

  // Sets default auth strategy
  server.auth.default('jwt');

  // Sets routes prefix
  server.realm.modifiers.route.prefix = '/api';

  // Registers routes
  server.route(AppRoutes.routes);

  await server.start();

  console.log('server running at: ' + server.info.uri);
};

start();
