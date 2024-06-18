const { 
  addRatingBook, 
  getRatingByIsbn, 
  getAllRatedBook, 
  putRating,
  checkBook,
  checkIsbnHasBeenRated,
  deleteRating
} = require('../model/ratingBook');

const addRate = async (req, res) => {
  const userId = req.user.id;
  const { isbn, rating, review } = req.body;
  const uppercaseIsbn = isbn.toUpperCase();

  try{
    const bookInDb = await checkBook(uppercaseIsbn);
    if (bookInDb) {
      return res.status(404).send({
        status: 'fail',
        message: 'E-book tidak ditemukan.'
      });
    }

    const hasBeenRated = await checkIsbnHasBeenRated(userId, uppercaseIsbn);
    if (hasBeenRated) {
      return res.status(400).send({
        status: 'fail',
        message: 'E-book sudah dinilai'
      });
    }

    await addRatingBook(userId, uppercaseIsbn, rating, review);

    return res.status(200).send({
      status: 'success',
      messsage: 'E-book berhasil dinilai.'
    });
  } catch(error) {
    console.error('Error adding rating:', error);
    return res.status(500).send({
      status: 'fail',
      messsage: 'Terjadi kesalahan pada server, silakan coba lagi.'
    });
  }
}

const getAllRated = async (req, res) => {
  try {
    const userId = req.user.id;
    const ratedBooks = await getAllRatedBook(userId);
    return res.status(200).send({
      status: 'success',
      data : ratedBooks
    });
  } catch (error) {
      console.error('Failed to fetch rated books:', error);
      return res.status(500).send({
        status: 'fail',
        messsage: 'Terjadi kesalahan pada server, silakan coba lagi.'
      });
  }
}

const getBookRating = async (req, res) => {
  const { isbn } = req.params;

  if (!isbn) {
    return res.status(404).send({
      status: 'fail',
      message: 'Buku tidak ditemukan.'
    });
  }

  try {
    const userId = req.user.id;
    const ratings = await getRatingByIsbn(userId, isbn);

    res.status(200).send({
      status: 'success',
      data: ratings
    });
  } catch (error) {
    console.error('Error getting average rating:', error);
    res.status(500).send({
      status: 'fail',
      messsage: 'Terjadi kesalahan pada server, silakan coba lagi.'
    });
  }
};

const updateRating = async (req,res) => {
  const userId = req.user.id;
  const { isbn, rating, review } = req.body;

  if (!isbn) {
    res.status(404).send({
      status: 'fail',
      message: 'E-book tidak ditemukan.'
    });
  }

  if (!rating && !review) {
    res.status(400).send({
      status: 'fail',
      message: 'Isi rating dan reviewnya.'
    });
  }

  try {
    await putRating(userId, isbn, rating, review);
    return res.status(200).send({
      status: 'success',
      message: 'Rating berhasil diedit.'
    });
  } catch (error) {
    console.log('Error at controller: ', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Terjadi kesalahan pada server, silakan coba lagi.'
    });
  }
}

const deletingRating = async(req,res) => {
  const userId = req.user.id;
  const { isbn } = req.params;

  if (!isbn) {
    res.status(404).send({
      status: 'fail',
      message: 'E-book tidak ditemukan.'
    });
  }

  try {
    await deleteRating(userId, isbn);
    res.status(200).send({
      status: 'success',
      message: 'Rating berhasil dihapus.'
    });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).send({
      status: 'error',
      message: 'Internal server error'
    });
  }
}
module.exports = {
  addRate,
  getBookRating,
  getAllRated,
  updateRating,
  deletingRating
};
