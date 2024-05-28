const db = require('../config/configFireStore')
const bcrypt = require('bcryptjs')

const dataUser = db.collection('users');

const createUser = async (email, passsword) => {
    const password = await bcrypt.hash(passsword,10);
    const userRef = await dataUser.add({ email, password })
    return userRef.id
}

const findingUser = async (email) => {
    const getUser = await dataUser.where('email', '==', email).get()
    if(getUser.empty){
        return null
    }
    const userDoc = getUser.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
}

const comparePass = async (currentPass, passStored) => {
    return bcrypt.compare(currentPass, passStored)
}

module.exports = { createUser, findingUser, comparePass }