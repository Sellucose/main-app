const firestore = require('../config/firestoreConfig')

const ratingBook = firestore.collection('rateBook');
const addRatingBook = async ( isbn, user_id, rate) => {
    await ratingBook.add({
        isbn,
        user_id,
        rate
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