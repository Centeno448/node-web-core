const BookExchangeController = require('../controllers/bookExchangeController');

const routes = [
  {
    method: 'GET',
    path: '/exchange',
    handler: BookExchangeController.getAllExchanges
  },
  {
    method: 'POST',
    path: '/exchange',
    handler: BookExchangeController.addExchange
  },
  {
    method: 'GET',
    path: '/exchange/{id}',
    handler: BookExchangeController.getExchangeById
  },
  {
    method: 'PUT',
    path: '/exchange/{id}',
    handler: BookExchangeController.updateExchange
  },
  {
    method: 'DELETE',
    path: '/exchange/{id}',
    handler: BookExchangeController.deleteExchange
  }
];

exports.routes = routes;
