const { Filter } = require('@google-cloud/firestore');
const db = require('../config/firestoreConfig');
const bcrypt = require('bcryptjs');

const usersRef = db.collection('users');

const createUser = async (email, username, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRef = await usersRef.add({ email, username, password: hashedPassword });
        return userRef.id;
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

const checkIfEmailIsRegistered = async (email, exceptUserId = null) => {
    try {
        let userQuery = usersRef.where('email', '==', email);

        if (exceptUserId != null) {
            userQuery = userQuery.where('__name__', '!=', exceptUserId); 
        }

        const userSnapshot = await userQuery.get();
        
        return !userSnapshot.empty;
    } catch (error) {
        throw error;
    }
}

const checkIfUsernameIsTaken = async (username, exceptUserId = null) => {
    try {
        let userQuery = usersRef.where('username', '==', username);

        if (exceptUserId != null) {
            userQuery = userQuery.where('__name__', '!=', exceptUserId); 
        }

        const userSnapshot = await userQuery.get();

        return !userSnapshot.empty;
    } catch (error) {
        throw error;
    }
}

const comparePass = async (currentPass, passStored) =>
    bcrypt.compare(currentPass, passStored);

module.exports = { createUser, findUser, comparePass, checkIfEmailIsRegistered, checkIfUsernameIsTaken }