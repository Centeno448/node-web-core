const userController = require('../controllers/userController');

const routes = [
  {
    method: 'GET',
    path: '/user',
    handler: userController.getAllUsers
  }
];

exports.routes = routes;
