const authMiddleware = require('../middleware/auth');
const { getSavedBooksController, saveBookController } = require('../controller/savedBooksController');

module.exports = [
  {
    path: '/books/saved',
    method: 'get',
    middleware: authMiddleware,
    controller: getSavedBooksController
  },
  {
    path: '/books/saved',
    method: 'post',
    middleware: authMiddleware,
    controller: saveBookController
  }
];