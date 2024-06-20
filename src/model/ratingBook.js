const firestore = require('../config/firestoreConfig')

const ratingBook = firestore.collection('rated_books');
const book = firestore.collection('books');

const addRatingBook = async (user_id, isbn, rate) => {
    try {
        const newRating = {
            "User-ID" : user_id,
            "ISBN" : isbn,
            "Book-Rating" : rate,
        };
        const docRef = await ratingBook.add(newRating);
        return docRef.id;
    } catch (error) {
        throw error;
    }
}

const getRatingByIsbn = async isbn => {
    const snapshot = await ratingBook.where('ISBN', '==', isbn).get();
    return snapshot.docs.map(doc => ({ ...doc.data() }));
}

const getAllRatedBook = async () => {
    try {
        const snapshot = await ratingBook.where("Book-Rating", ">", 0).orderBy("Book-Rating", "asc").get()
        return snapshot.docs.map(doc => ({ ...doc.data() }));
    } catch (error) {
        console.error('Error getting rated book:', error);
        throw error;
    }
};

const putRating = async (userId, isbn, newRating) => {
    try {
        const ratingUpdate = await ratingBook.where('ISBN', '==', isbn).get();

        // Collect all update promises in an array
        const updatePromises = ratingUpdate.docs.map(async doc => {
            await ratingBook.doc(doc.id).update({
                'Book-Rating': newRating,
                'User-ID': userId  // Include the User-ID in the document update
            });
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);

        console.log('Rating update complete');
    } catch(error) {
        console.error('Error updating ratings:', error);
        throw error;
    }
}


const checkIsbnHasBeenRated = async(isbn,user_id) => {
    try {
        const alreadyRated = await ratingBook.where('ISBN', '==', isbn).where('User-ID', '==', user_id).get()
        return !alreadyRated.empty
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
        const queryIsbn = await ratingBook.where('ISBN', '==', isbn).where('User-ID', '==', user_id).get();
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