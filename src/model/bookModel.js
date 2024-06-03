const firestore = require('../config/firestoreConfig');

const checkBookByISBN = async isbn => {
  try {
    const docRef = firestore.collection('books').doc(isbn);
    const docSnapshot = await docRef.get();
    return docSnapshot.exists;
  } catch (error) {
    console.error('Error getting the document:', error);
    throw error;
  }
}

module.exports = { checkBookByISBN };