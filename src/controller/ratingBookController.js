const { addRatingBook, getRatingByIsbn } = require('../model/ratingBook');
const { findUser } = require('../model/userModel');

const addRate = async (req, res) => {
  const { isbn, username, rate, review } = req.body;
  try{
    const user = await findUser(username)

    if(!user) {
      return res.status(404).send('User not found');
    }

    await addRatingBook(isbn, username, rate, review)
    res.status(200).send('Rating added successfully');
  } catch(error) {
    console.error('Error adding rating:', error);
    res.status(500).send('Internal server error');
  }
}

const getAverageRating = async (req, res) => {
  const { isbn } = req.params;

  if(!isbn) {
    return res.status(400).send('ISBN is required');
  }

  try {
    const snapshot = await getRatingByIsbn(isbn);

    if (snapshot.empty) {
      return res.status(404).send('No ratings found for this ISBN');
    }
    
    let totalRating = 0;
    let count = 0;

    snapshot.forEach(doc => {
      totalRating += doc.data().rate;
      count++;
    });

    const averageRating = totalRating / count;

    res.status(200).send({ isbn, averageRating, ratingCount: count });
  } catch (error) {
    console.error('Error getting average rating:', error);
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  addRate,
  getAverageRating,
};
