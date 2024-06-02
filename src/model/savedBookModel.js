const firestore = require('../config/configFireStore')

const getSavedBooks = async (userId) => {
  try {
    return await firestore.collection('saved_books')
      .where('user_id', '==', userId)
      .get();
  } catch (error) {
    throw error;
  }
}

const isBookAlreadySaved = async (userId, isbn) => {
  try {
    const snapshot = await firestore.collection('saved_books')
    .where('user_id', '==', userId)
    .where('isbn', '==', isbn)
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
      user_id: userId,
      isbn
    });
  } catch (error) {
    throw error;
  }
}

const unsaveBook = async (userId, isbn) => {
  try {
    const snapshot = await firestore.collection('saved_books')
      .where('user_id', '==', userId)
      .where('isbn', '==', isbn)
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