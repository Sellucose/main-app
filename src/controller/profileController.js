const firestore = require('../config/firestoreConfig');
const { checkIfEmailIsRegistered, checkIfUsernameIsTaken } = require('../model/userModel');

const getProfileController = async (req, res) => {
  const userId = req.user.id;

  try {
    const userDocRef = firestore.collection('users').doc(userId);
    const userSnapshot = await userDocRef.get();

    if (!userSnapshot.exists) {
      return res.status(404).json({
        status: 'fail',
        message: 'User tidak ditemukan.'
      });
    }

    const userData = userSnapshot.data();

    return res.status(200).send({
      status: 'success',
      message: 'Berhasil mengambil data profil.',
      data: {
        id: userSnapshot.id,
        email: userData.email,
        username: userData.username
      }
    });
  } catch (error) {
    console.log('Error at controller: ', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Terjadi kesalahan pada server, silakan coba lagi.'
    });
  }
}

const changeUsername = async (userId, username) => {
  try {
    await firestore.collection('users').doc(userId).set({ username });
  } catch (error) {
    throw error;
  }
}

const changeEmail = async (userId, email) => {
  try {
    await firestore.collection('users').doc(userId).set({ email });
  } catch (error) {
    throw error;
  }
}

const changePassword = async (userId, password) => {
  try {
    const password = await bcrypt.hash(password, 10);
    firestore.collection('users').doc(userId).set({ password });
  } catch (error) {
    throw error;
  }
}

const updateProfileController = async (req, res) => {
  const userId = req.user.id;
  const { email, username, password, password_confirmation } = req.body;

  try {
    const userDocRef = firestore.collection('users').doc(userId);
    const userSnapshot = await userDocRef.get();

    if (!userSnapshot.exists) {
      return res.status(404).json({
        status: 'fail',
        message: 'User tidak ditemukan.'
      });
    }

    if (username) {
      if (username.length < 4) {
        return res.status(422).json({
          status: 'fail',
          message: 'Username paling tidak harus berisi 4 karakter.'
        });
      }
    
      if (await checkIfUsernameIsTaken(username, userId)) {
        return res.status(409).json({
          status: 'fail',
          message: 'Username tersebut telah digunakan.'
        });
      }

      await changeUsername(userId, username);
    }

    if (password) {
      if (password.length < 8) {
        return res.status(422).json({
          status: 'fail',
          message: 'Password paling tidak harus berisi 8 karakter.'
        });
      }
    
      if (password !== password_confirmation) {
        return res.status(409).json({
          status: 'fail',
          message: 'Password tidak sesuai.'
        });
      }

      await changePassword(userId, password);
    }

    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(422).json({
          status: 'fail',
          message: 'Email tidak valid.'
        });
      }
    
      if (checkIfEmailIsRegistered(email, userId)) {
        return res.status(409).send({
          status: 'fail',
          message: 'Email telah terdaftar.'
        });
      }

      await changeEmail(userId, email);

      return res.status(200).json({
        status: 'success',
        message: 'Profil berhasil diedit, dan silakan cek emailmu.'
      });
    } else {
      return res.status(200).json({
        status: 'success',
        message: 'Profil berhasil diedit.'
      });
    }
  } catch (error) {
    console.log('Error at controller: ', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Terjadi kesalahan pada server, silakan coba lagi.'
    });
  }
}

module.exports = { getProfileController, updateProfileController };