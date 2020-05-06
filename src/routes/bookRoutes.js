const BookController = require('../controllers/bookController');

const routes = [
  {
    method: 'GET',
    path: '/book',
    handler: BookController.getAllBooks
  },
  {
    method: 'POST',
    path: '/book-user',
    handler: BookController.getBookByUser
  },
  {
    method: 'POST',
    path: '/book',
    handler: BookController.addBook
  },
  {
    method: 'GET',
    path: '/book/{id}',
    handler: BookController.getBookById
  },
  {
    method: 'PUT',
    path: '/book/{id}',
    handler: BookController.updateBook
  },
  {
    method: 'DELETE',
    path: '/book/{id}',
    handler: BookController.deleteBook
  }
];

exports.routes = routes;
