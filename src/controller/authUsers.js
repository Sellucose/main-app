const fs = require('fs');
const { createUser, findingUser, comparePass }  = require('../model/userModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = fs.readFileSync(process.env.JWT_KEY_PATH);

const generateToken = (users) => {
    return jwt.sign({ id: users.id, email: users.email}, JWT_SECRET.toString(), { expiresIn: '1h' })
}

const register = async (req, res) => {
    const { email, password, password_confirmation } = req.body;

    try {
        const existUser = await findingUser(email);

        // Validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(422).json({
                status: 'fail',
                message: 'Email tidak valid.'
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

        // check user exist
        if (existUser) {
            return res.status(409).json({
                status: 'fail',
                message: 'Email telah terdaftar.'
            });
        }

        const userId = await createUser(email, password);
        return res.status(201).json({
            status: 'success',
            message: 'Registrasi berhasil.',
            data: {
                user_id: userId
            }
        });
    } catch(error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Terjadi kesalahan pada server, silakan coba lagi.'
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existUser = await findingUser(email);

        // check if the account is not available
        if (!existUser) {
            return res.status(401).json({
                status: 'fail',
                message: 'Kredensial tidak cocok.'
            })
        }

        // check the password
        const checkPassword = await comparePass(password, existUser.password)
        if (!existUser || !checkPassword){
            return res.status(401).json({
                status: 'fail',
                message: 'Kredensial tidak cocok.'
            })
        }

        const token = generateToken(existUser);

        return res.json({ token });
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Terjadi kesalahan pada server, silakan coba lagi.'
        })
    }
}

module.exports = { register, login }