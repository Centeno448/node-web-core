const UserRoutes = require('./userRoutes');
const AuthRoutes = require('./authRoutes');
const BookRoutes = require('./bookRoutes');

exports.routes = [
  ...UserRoutes.routes,
  ...AuthRoutes.routes,
  ...BookRoutes.routes
];
