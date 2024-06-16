const firestore = require('../config/firestoreConfig')

const ratingBook = firestore.collection('rateBook');
const book = firestore.collection('books');

const addRatingBook = async (ISBN, rate,review,user_id) => {
    try {
        const newRating = {
            user_id,
            ISBN,
            rate,
            review
        };
        const docRef = await ratingBook.add(newRating);
        return docRef.id;
    } catch (error) {
        throw error;
    }
}

const getRatingByIsbn = async isbn => {
    const snapshot = await ratingBook.where('isbn', '==', isbn).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const getAllRatedBook = async () => {
    try {
        const snapshot = await ratingBook.where('rate','>', 0).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting rated book:', error);
        throw error;
    }
};

const putRating = async (isbn, newRating, newReview) => {
    try{
        const ratingUpdate = await ratingBook.where ('isbn', '==', isbn).get();
        ratingUpdate.forEach(async doc => {
            await ratingBook.doc(doc.id).update({rate:newRating, review:newReview})
        })
    }catch(error) {
        console.error('Error getting rated book:', error);
        throw error;
    }
}
const checkIsbnHasBeenRated = async(isbn) => {
    try {
        await ratingBook.where('isbn', '==', isbn).get()
    } catch (error) {
        console.error('Error getting rated book:', error);
        throw error;
    }
}
const checkBook = async(isbn) => {
    try {
        const bookData = await book.where('ISBN', '==', isbn).get()
        return bookData.empty;
    } catch (error) {
        console.error('Error getting rated book:', error);
        throw error;
    }
}

const deleteRating = async (isbn,user_id) => {
    try{
        const queryIsbn = await ratingBook.where('isbn', '==', isbn).where('user_id', '==', user_id).get();
        const batch = firestore.batch();
        queryIsbn.forEach(doc => {
            batch.delete(doc.ref)
        })
        await batch.commit();
        return true;
    }catch(e) {
        throw e;
    }
}

module.exports = {
    addRatingBook,
    getRatingByIsbn,
    getAllRatedBook,
    putRating,
    checkBook,
    checkIsbnHasBeenRated,
    deleteRating
}