const AuthRoutes = require('./authRoutes');
const BookRoutes = require('./bookRoutes');
const RatingRoutes = require('./ratingRoutes');
const CategoryRoutes = require('./categoryRoutes');
const BookExchangeRoutes = require('./bookExchangeRoutes');

exports.routes = [
  ...AuthRoutes.routes,
  ...BookRoutes.routes,
  ...RatingRoutes.routes,
  ...CategoryRoutes.routes,
  ...BookExchangeRoutes.routes
];
