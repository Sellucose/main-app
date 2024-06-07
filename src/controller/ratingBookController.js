const { addRatingBook, getRatingByIsbn } = require('../model/ratingBook');

const addRate = async (req, res) => {
  const { isbn, reviewer, rate, review } = req.body;

  try{
    await addRatingBook(isbn, reviewer, rate, review)
    res.status(200).send('Rating added successfully');
  } catch(error) {
    console.error('Error adding rating:', error);
    res.status(500).send('Internal server error');
  }
}

const getAverageRating = async (req, res) => {
  const { isbn } = req.params;

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
