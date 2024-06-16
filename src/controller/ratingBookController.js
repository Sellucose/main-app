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
  const { ISBN, rate, review } = req.body;
  const uppercaseIsbn = ISBN.toUpperCase();
  try{
    const bookInDb = await checkBook(uppercaseIsbn);
    if(bookInDb){
      return res.status(404).send({
        status: 'fail',
        message: 'E-book tidak ditemukan.'
      })
    }

    const hasBeenRated = await checkIsbnHasBeenRated(uppercaseIsbn);
    if(hasBeenRated){
      return res.status(400).send({
        status: 'fail',
        message: 'E-book sudah dinilai'
      })
    }

    await addRatingBook(req.user.id, uppercaseIsbn, rate, review)
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
    const ratedBooks = await getAllRatedBook()
    return res.status(200).send({
      status: 'success',
      data : ratedBooks
    });
  } catch (error) {
      console.error('Failed to fetch rated books:', error);
      res.status(500).send('Internal Server Error');
  }
}

const getBookRating = async (req, res) => {
  const { isbn } = req.params;

  if(!isbn) {
    return res.status(400).send('Buku tidak ditemukan.');
  }

  try {
    const snapshot = await getRatingByIsbn(isbn);

    if (snapshot.empty) {
      return res.status(404).send('No ratings found for this ISBN');
    }
    const users = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      users.push({ userId: data.user_id, rating: data.rate });
    });

    res.status(200).send({ isbn, users });
  } catch (error) {
    console.error('Error getting average rating:', error);
    res.status(500).send('Internal server error');
  }
};

const updateRating = async (req,res) => {
  const { isbn, rate, review } = req.body;

  if(!isbn) {
    res.status(404).send({
      status: 'fail',
      message: 'E-book tidak ditemukan.'
    })
  }
  if(!rate && !review){
    res.status(400).send({
      status: 'fail',
      message: 'Isi rating dan reviewnya.'
    })
  }
  try {
    await putRating(isbn,rate,review)
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
  const { isbn } = req.params
  const user_id = req.user.id;
  if(!isbn) {
    res.status(404).send({
      status: 'fail',
      message: 'E-book tidak ditemukan.'
    })
  }
  try {
    await deleteRating(isbn, user_id);
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
