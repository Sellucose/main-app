const {  addRate, getAverageRating } = require('../controller/ratingBookController')
const authMiddleware = require('../middleware/auth')
module.exports = [
    {
        path: '/books/rated',
        method: 'post',
        middleware: authMiddleware,
        controller: addRate
    },
    {
        path: '/books/:isbn',
        method: 'get',
        middleware: authMiddleware,
        controller: getAverageRating
    }
]