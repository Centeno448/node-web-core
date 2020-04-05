const UserRoutes = require('./userRoutes');
const AuthRoutes = require('./authRoutes');
const EventTypeRoutes = require('./eventTypeRoutes');
const EventRoutes = require('./eventRoutes');

exports.routes = [
  ...UserRoutes.routes,
  ...AuthRoutes.routes,
  ...EventTypeRoutes.routes,
  ...EventRoutes.routes
];
