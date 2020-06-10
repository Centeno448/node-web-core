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
    handler: BookExchangeController.getExchangeByUserId
  },
  {
    method: 'POST',
    path: '/exchange/valid/',
    handler: BookExchangeController.getValidExchanges
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
