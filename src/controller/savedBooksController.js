const { checkBookByISBN } = require('../model/bookModel');
const { getSavedBooks, isBookAlreadySaved, saveBook, unsaveBook } = require('../model/savedBookModel');

const getSavedBooksController = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = req.query.limit || 9;
    let lastCreatedAt = req.query.lastCreatedAt;

    const books = await getSavedBooks(userId, limit, lastCreatedAt);
    lastCreatedAt = books.length > 0
      ? books[books.length - 1].createdAt
      : null;
    
    const statusCode = books.length > 0 ? 200 : 404;

    res.status(statusCode).send({
      status: 'success',
      data: { books, lastCreatedAt }
    });
  } catch (error) {
    console.log('Error at controller: ', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Terjadi kesalahan pada server, silakan coba lagi.'
    });
  }
}

const saveBookController = async (req, res) => {
  const userId = req.user.id;
  const isbn = req.body.isbn;

  try {
    if (!(await checkBookByISBN(isbn))) {
      return res.status(404).send({
        status: 'fail',
        message: 'Buku tidak ditemukan.'
      });
    }

    const isAlreadySaved = await isBookAlreadySaved(userId, isbn);

    if (isAlreadySaved) {
      await unsaveBook(userId, isbn);
    } else {
      await saveBook(userId, isbn);
    }

    const isBookSavedNow = !isAlreadySaved;

    return res.status(200).send({
      status: 'success',
      message: `Rekomendasi berhasil ${isBookSavedNow ? 'disimpan' : 'dihapus'}.`,
      data: {
        is_book_saved: isBookSavedNow
      }
    });
  } catch (error) {
    console.log('Error at controller: ', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Terjadi kesalahan pada server, silakan coba lagi.'
    });
  }
}

module.exports = { getSavedBooksController, saveBookController };