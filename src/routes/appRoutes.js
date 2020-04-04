const UserRoutes = require('./userRoutes');
const AuthRoutes = require('./authRoutes');
const EventTypeRoutes = require('./eventTypeRoutes');

exports.routes = [
  ...UserRoutes.routes,
  ...AuthRoutes.routes,
  ...EventTypeRoutes.routes
];
