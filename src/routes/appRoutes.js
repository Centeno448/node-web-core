const AuthRoutes = require('./authRoutes');
const BookRoutes = require('./bookRoutes');
const RatingRoutes = require('./ratingRoutes');
const CategoryRoutes = require('./categoryRoutes');
const BookExchangeRoutes = require('./bookExchangeRoutes');
const UserRoutes = require('./userRoutes');

exports.routes = [
  ...AuthRoutes.routes,
  ...BookRoutes.routes,
  ...RatingRoutes.routes,
  ...CategoryRoutes.routes,
  ...BookExchangeRoutes.routes,
  ...UserRoutes.routes
];
