const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

exports.routes = [...userRoutes.routes, ...authRoutes.routes];
