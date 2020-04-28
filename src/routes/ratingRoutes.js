const RatingController = require('../controllers/ratingController');

const routes = [
  {
    method: 'GET',
    path: '/rating',
    handler: RatingController.getAllRatings
  },
  {
    method: 'POST',
    path: '/rating',
    handler: RatingController.addRating
  },
  {
    method: 'GET',
    path: '/rating/{id}',
    handler: RatingController.getRatingById
  },
  {
    method: 'PUT',
    path: '/rating/{id}',
    handler: RatingController.updateRating
  },
  {
    method: 'DELETE',
    path: '/rating/{id}',
    handler: RatingController.deleteRating
  }
];

exports.routes = routes;
