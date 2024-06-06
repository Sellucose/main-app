const { Filter } = require('@google-cloud/firestore');
const db = require('../config/firestoreConfig')
const bcrypt = require('bcryptjs')

const usersRef = db.collection('users');

const createUser = async (email, passsword) => {
    try {
        const password = await bcrypt.hash(passsword,10);
        const userRef = await usersRef.add({ email, password })
        return userRef.id
    } catch (error) {
        throw error;
    }
}

const findUser = async keyword => {
    const getUser = await usersRef
        .where(Filter.or(
            Filter.where('email', '==', keyword),
            Filter.where('username', '==', keyword)
        ))
        .get();
    
    if (getUser.empty) {
        return null;
    }

    const userDoc = getUser.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
}

const checkIfEmailRegistered = async email => {
    try {
        const userSnapshot = await usersRef.where('email', '==', email).get();
        return !userSnapshot.empty;
    } catch (error) {
        throw error;
    }
}

const checkIfUsernameTaken = async username => {
    try {
        const userSnapshot = await usersRef.where('username', '==', username).get();
        return !userSnapshot.empty;
    } catch (error) {
        throw error;
    }
}

const comparePass = async (currentPass, passStored) =>
    bcrypt.compare(currentPass, passStored);

module.exports = { createUser, findUser, comparePass, checkIfEmailRegistered, checkIfUsernameTaken }