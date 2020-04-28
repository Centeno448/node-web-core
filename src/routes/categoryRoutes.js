const CategoryController = require('../controllers/categoryController');

const routes = [
  {
    method: 'GET',
    path: '/category',
    handler: CategoryController.getAllCategories
  },
  {
    method: 'POST',
    path: '/category',
    handler: CategoryController.addCategory
  },
  {
    method: 'GET',
    path: '/category/{id}',
    handler: CategoryController.getCategoryById
  },
  {
    method: 'PUT',
    path: '/category/{id}',
    handler: CategoryController.updateCategory
  },
  {
    method: 'DELETE',
    path: '/category/{id}',
    handler: CategoryController.deleteCategory
  }
];

exports.routes = routes;
