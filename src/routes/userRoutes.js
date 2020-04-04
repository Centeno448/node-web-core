const userController = require('../controllers/userController');

const routes = [
  {
    method: 'GET',
    path: '/users',
    handler: userController.getAll
  },
  {
    method: 'POST',
    path: '/users',
    handler: userController.addUser
  },
  {
    method: 'PATCH',
    path: '/users/{id}',
    handler: userController.updateUser
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: userController.deleteUser
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: userController.getUser
  }
];

exports.routes = routes;
