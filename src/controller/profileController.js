const firestore = require('../config/firestoreConfig');
const { checkIfEmailIsRegistered, checkIfUsernameIsTaken } = require('../model/userModel');
const bcrypt = require('bcryptjs');

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

const changeUsername = (batch, userId, username) => {
  try {
    batch.update(firestore.collection('users').doc(userId), { username });
  } catch (error) {
    throw error;
  }
}

const changeEmail = (batch, userId, email) => {
  try {
    batch.update(firestore.collection('users').doc(userId), { email });
  } catch (error) {
    throw error;
  }
}

const changePassword = async (batch, userId, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    batch.update(firestore.collection('users').doc(userId), { password: hashedPassword });
  } catch (error) {
    throw error;
  }
}

const updateProfileController = async (req, res) => {
  const userId = req.user.id;
  const { email, username, password, password_confirmation } = req.body;

  try {
    const batch = firestore.batch();

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

      changeUsername(batch, userId, username);
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

      await changePassword(batch, userId, password);
    }

    if (email && (email != userSnapshot.get('email'))) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(422).json({
          status: 'fail',
          message: 'Email tidak valid.'
        });
      }
    
      if (await checkIfEmailIsRegistered(email, userId)) {
        return res.status(409).send({
          status: 'fail',
          message: 'Email telah terdaftar.'
        });
      }

      changeEmail(batch, userId, email);

      batch.commit();

      return res.status(200).json({
        status: 'success',
        message: 'Profil berhasil diedit, dan silakan cek emailmu.'
      });
    } else {
      batch.commit();
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