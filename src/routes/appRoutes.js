const AuthRoutes = require('./authRoutes');
const BookRoutes = require('./bookRoutes');

exports.routes = [...AuthRoutes.routes, ...BookRoutes.routes];
