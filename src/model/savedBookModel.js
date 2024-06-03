const firestore = require('../config/firestoreConfig')

const getSavedBooks = async (userId) => {
  try {
    const snapshot = await firestore.collection('saved_books')
      .where('user_id', '==', firestore.doc(`users/${userId}`))
      .get();

    const results = [];
      
    for (let i = 0; i <= snapshot.docs.length - 1; i++) {
      const bookRef = await snapshot.docs[i].get('isbn');
      const bookSnapshot = await bookRef.get();

      results.push({
        id: snapshot.docs[i].id,
        book: bookSnapshot.data()
      });
    }

    return results;
  } catch (error) {
    throw error;
  }
}

const isBookAlreadySaved = async (userId, isbn) => {
  try {
    const snapshot = await firestore.collection('saved_books')
      .where('user_id', '==', firestore.doc(`users/${userId}`))
      .where('isbn', '==', firestore.doc(`books/${isbn}`))
      .get();
  
    return !snapshot.empty;
  } catch (error) {
    throw error;
  }
}

const saveBook = async (userId, isbn) => {
  try {
    const document = firestore.collection('saved_books').doc();
    return await document.set({
      user_id: firestore.doc(`users/${userId}`),
      isbn: firestore.doc(`books/${isbn}`)
    });
  } catch (error) {
    throw error;
  }
}

const unsaveBook = async (userId, isbn) => {
  try {
    const snapshot = await firestore.collection('saved_books')
      .where('user_id', '==', firestore.doc(`users/${userId}`))
      .where('isbn', '==', firestore.doc(`books/${isbn}`))
      .get();

    if (snapshot.size > 0 && snapshot.docs[0].exists) {
      const docId = snapshot.docs[0].id;
      return await firestore.doc(`saved_books/${docId}`).delete();
    }

    return false;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getSavedBooks,
  isBookAlreadySaved,
  saveBook,
  unsaveBook
};