const AuthRoutes = require('./authRoutes');
const BookRoutes = require('./bookRoutes');
const RatingRoutes = require('./ratingRoutes');
const CategoryRoutes = require('./categoryRoutes');
const BookExchangeRoutes = require('./bookExchangeRoutes');
const UserRoutes = require('./userRoutes');
const ReportRoutes = require('./reportRoutes');

exports.routes = [
  ...AuthRoutes.routes,
  ...BookRoutes.routes,
  ...RatingRoutes.routes,
  ...CategoryRoutes.routes,
  ...BookExchangeRoutes.routes,
  ...UserRoutes.routes,
  ...ReportRoutes.routes
];
