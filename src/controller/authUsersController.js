const fs = require('fs');
const jwt = require('jsonwebtoken');
const {
    createUser,
    findUser,
    comparePass,
    checkIfEmailIsRegistered,
    checkIfUsernameIsTaken
}  = require('../model/userModel');

const JWT_SECRET = process.env.JWT_SECRET_KEY

const generateToken = user =>
    jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET.toString(),
        { expiresIn: '1h' }
    );

const register = async (req, res) => {
    const { email, username, password, password_confirmation } = req.body;

    try {
        // Validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(422).json({
                status: 'fail',
                message: 'Email tidak valid.'
            });
        }

        // check email registered
        if (await checkIfEmailIsRegistered(email)) {
            return res.status(409).json({
                status: 'fail',
                message: 'Email telah terdaftar.'
            });
        }

        // Check if username is too short
        if (username.length < 4) {
            return res.status(422).json({
                status: 'fail',
                message: 'Username paling tidak harus berisi 4 karakter.'
            });
        }

        // Check if username is too short
        if (await checkIfUsernameIsTaken(username)) {
            return res.status(409).json({
                status: 'fail',
                message: 'Username tersebut telah digunakan.'
            });
        }

        // Check if password is too short
        if (password.length < 8) {
            return res.status(422).json({
                status: 'fail',
                message: 'Password paling tidak harus berisi 8 karakter.'
            });
        }

        // Check if password and password confirmation match
        if (password !== password_confirmation) {
            return res.status(409).json({
                status: 'fail',
                message: 'Password tidak sesuai.'
            });
        }

        const userId = await createUser(email, username, password);

        return res.status(201).json({
            status: 'success',
            message: 'Registrasi berhasil, anda sudah bisa login.',
            data: { user_id: userId }
        });
    } catch(error) {
        console.log('Error at controller: ', error);
        return res.status(500).json({
            status: 'fail',
            message: 'Terjadi kesalahan pada server, silakan coba lagi.'
        });
    }
}

const login = async (req, res) => {
    const { keyword, password } = req.body;

    try {
        const user = await findUser(keyword);

        // check if the account is not available
        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'Kredensial tidak cocok.'
            })
        }

        // check the password
        const checkPassword = await comparePass(password, user.password)
        if (!user || !checkPassword){
            return res.status(401).json({
                status: 'fail',
                message: 'Kredensial tidak cocok.'
            })
        }

        const token = generateToken(user);

        return res.json({
            status: 'success',
            message: 'Login berhasil.',
            token
        });
    } catch (error) {
        console.log('Error at controller: ', error);
        return res.status(500).json({
            status: 'fail',
            message: 'Terjadi kesalahan pada server, silakan coba lagi.'
        });
    }
}

module.exports = { register, login };