const reportController = require('../controllers/reportController');

const routes = [
  {
    method: 'GET',
    path: '/report/averageRatings',
    handler: reportController.averageUserRating
  },
  {
    method: 'GET',
    path: '/report/mostExchangedBooks',
    handler: reportController.mostExchangedBooks
  },
  {
    method: 'GET',
    path: '/report/mostExchangedCategories',
    handler: reportController.mostExchangedCategories
  },
  {
    method: 'GET',
    path: '/report/mostExchangesByUsers',
    handler: reportController.mostExchangesByUsers
  },
  {
    method: 'GET',
    path: '/report/mostExchangesByMonth',
    handler: reportController.mostExchangesByMonth
  }
];

exports.routes = routes;
