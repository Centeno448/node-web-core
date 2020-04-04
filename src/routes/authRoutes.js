const authController = require('../controllers/authController');

const routes = [
  {
    method: 'POST',
    path: '/auth/register',
    options: {
      auth: {
        strategy: 'key'
      }
    },
    handler: authController.register
  },
  {
    method: 'POST',
    path: '/auth/login',
    options: {
      auth: {
        strategy: 'key'
      }
    },
    handler: authController.login
  },
  {
    method: 'POST',
    path: '/auth/logout',
    handler: authController.logout
  },
  {
    method: 'POST',
    path: '/Token',
    handler: authController.refresh
  }
];

exports.routes = routes;
