const { createUser, findingUser, comparePass }  = require('../model/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (users) => {
    return jwt.sign({ id: users.id, email: users.email}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
}

const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existUser = await findingUser(email);
        if(existUser){
            return res.status(400).json({ error: 'Username already exists' })
        }
        const userId = await createUser(email, password);
        res.status(201).json({ message: 'User registered successfully', userId });
    }catch(error) {
        res.status(500).json({ error: 'internal server error' })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const existUser = await findingUser(email);
        const checkPassword = await comparePass(password, existUser.password)
        if (!existUser || !checkPassword){
            return res.status(401).json({
                error: 'Invalid email or password'
            })
        }
        const token = generateToken(existUser);
        res.json({ token });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

module.exports = { register, login }