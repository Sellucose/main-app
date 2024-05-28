const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/authUsers');
const authMiddleware = require('../middleware/auth');

// Registrasi pengguna
router.post('/register', register);

// Login pengguna
router.post('/login', login);

router.get('/main', authMiddleware, (req,res) => {
    res.json({ message: 'login only bos', user: req.user });
})

module.exports = router;
