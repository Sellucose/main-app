const { checkBookByISBN, getBooksByISBN } = require('../model/bookModel');
const { getSavedBooks, isBookAlreadySaved, saveBook, unsaveBook } = require('../model/savedBookModel');

const getSavedBooksController = async (req, res) => {
  try {
    const userId = req.user.id;
  
    const snapshot = await getSavedBooks(userId);
    const bookISBNs = snapshot.docs.map(doc => doc.get('isbn'));
    const books = await getBooksByISBN(bookISBNs);

    let bookIndex = 0;
    
    const statusCode = snapshot.size > 0 ? 200 : 404;

    res.status(statusCode).send({
      status: 'success',
      data: snapshot.docs.map(doc => {
        return {
          id: doc.id,
          book: books[bookIndex++]
        }
      })
    });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Terjadi kesalahan pada server, silakan coba lagi.'
    });
  }
}

module.exports = { getSavedBooksController, saveBookController };