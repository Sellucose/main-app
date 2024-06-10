const firestore = require('../config/firestoreConfig')

const ratingBook = firestore.collection('rateBook');
const addRatingBook = async (isbn, username, rate,review) => {
    try {
        await ratingBook.add({
            isbn,
            username,
            rate,
            review
        });
    } catch (error) {
        throw error;
    }
}


const getRatingByIsbn = async isbn => {
    const snapshot = await ratingBook.where('isbn', '==', isbn).get();
    return snapshot
}

module.exports = {
    addRatingBook,
    getRatingByIsbn
}