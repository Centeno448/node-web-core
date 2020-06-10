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
    handler: RatingController.getRatingByUserId
  },
  {
    method: 'GET',
    path: '/rating/recieved/{id}',
    handler: RatingController.getRatingToUserId
  },
  {
    method: 'GET',
    path: '/rating/users/{id}',
    handler: RatingController.getUsersToRate
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
