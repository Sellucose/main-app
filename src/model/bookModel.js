const firestore = require('../config/firestoreConfig');

const checkBookByISBN = async (isbn) => {
  try {
    const docRef = await firestore.collection('books').doc(isbn).get();
    return docRef.exists;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

const getBookByISBN = async (bookDoc) => {
  try {
    const docRef = await bookDoc.get();
    return await docRef.data();
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

module.exports = { checkBookByISBN, getBookByISBN };