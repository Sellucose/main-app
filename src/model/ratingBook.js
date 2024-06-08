const firestore = require('../config/firestoreConfig')

const ratingBook = firestore.collection('rateBook');
const addRatingBook = async (isbn, reviewer, rate,review) => {
    await ratingBook.add({
        isbn,
        reviewer,
        rate,
        review
    });
}


const getRatingByIsbn = async isbn => {
    const snapshot = await ratingBook.where('isbn', '==', isbn).get();
    return snapshot
}

module.exports = {
    addRatingBook,
    getRatingByIsbn
}