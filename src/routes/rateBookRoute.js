const {  addRate, getBookRating, getAllRated, updateRating, deletingRating } = require('../controller/ratingBookController')
const authMiddleware = require('../middleware/auth')
module.exports = [
    {
        path: '/books/rated',
        method: 'post',
        middleware: authMiddleware,
        controller: addRate
    },
    {
        path: '/books/rated',
        method: 'get',
        middleware: authMiddleware,
        controller: getAllRated
    },
    {
        path: '/books/:isbn',
        method: 'get',
        middleware: authMiddleware,
        controller: getBookRating
    },
    {
        path: '/books/rate/update',
        method: 'put',
        middleware: authMiddleware,
        controller: updateRating
    },
    {
        path: '/books/rate/:isbn',
        method: 'delete',
        middleware: authMiddleware,
        controller: deletingRating
    }
]