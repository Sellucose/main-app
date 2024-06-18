const firestore = require('../config/firestoreConfig')

const ratingBook = firestore.collection('rated_books');
const book = firestore.collection('books');

const addRatingBook = async (userId, ISBN, rate, review) => {
    try {
        const newRating = {
            user: firestore.doc(`users/${userId}`),
            book: firestore.doc(`books/${ISBN}`),
            rate,
            review
        };
        const docRef = await ratingBook.add(newRating);
        return docRef.id;
    } catch (error) {
        throw error;
    }
}

const getRatingByIsbn = async (userId, isbn) => {
    const snapshot = await ratingBook
        .where('user', '==', firestore.doc(`users/${userId}`))
        .where('book', '==', firestore.doc(`books/${isbn}`))
        .get();
        
    const ratings = [];
        
    for (let i = 0; i < snapshot.size; i++) {
        const doc = snapshot.docs[i];
        const userRef = await doc.get('user');
        const userSnapshot = await userRef.get();

        ratings.push({
            id: doc.id,
            user: {
                id: userSnapshot.id,
                username: userSnapshot.get('username')
            },
            rate: doc.get('rate'),
            review: doc.get('review')
        });
    }

    return ratings;
}

const getAllRatedBook = async userId => {
    try {
        const snapshot = await ratingBook
            .where('rate', '>', 0)
            .where('user', '==', firestore.doc(`users/${userId}`))
            .get();

        const ratings = [];
            
        for (let i = 0; i < snapshot.size; i++) {
            const doc = snapshot.docs[i];
            const bookRef = await doc.get('book');
            const bookSnapshot = await bookRef.get();

            ratings.push({
                id: doc.id,
                rate: doc.get('rate'),
                book: bookSnapshot.data()
            });
        }

        return ratings;
    } catch (error) {
        console.error('Error getting rated book:', error);
        throw error;
    }
};

const putRating = async (userId, isbn, newRating, newReview) => {
    try{
        const ratingUpdate = await ratingBook
            .where('user', '==', firestore.doc(`users/${userId}`))
            .where ('book', '==', firestore.doc(`books/${isbn}`))
            .get();
        
        ratingUpdate.forEach(async doc => {
            await ratingBook.doc(doc.id).update({ rate: newRating, review: newReview })
        });
    }catch(error) {
        console.error('Error getting rated book:', error);
        throw error;
    }
}
const checkIsbnHasBeenRated = async (userId, isbn) => {
    try {
        await ratingBook
            .where('user', '==', firestore.doc(`users/${userId}`))
            .where('isbn', '==', isbn)
            .get();
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

const deleteRating = async (userId, isbn) => {
    try{
        const queryIsbn = await ratingBook
            .where('user', '==', firestore.doc(`users/${userId}`))
            .where('book', '==', firestore.doc(`books/${isbn}`))
            .get();

        if (queryIsbn.empty && queryIsbn.size > 0) {
            return false;
        }

        return await firestore.doc(`rated_books/${queryIsbn.docs[0].id}`).delete();
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