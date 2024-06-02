const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/authUsers');
const authMiddleware = require('../middleware/auth');
const { getSavedBooksController, saveBookController } = require('../controller/savedBooks');

// Registrasi pengguna
router.post('/register', register);

// Login pengguna
router.post('/login', login);

router.get('/main', authMiddleware, (req,res) => {
    res.json({ message: 'login only bos', user: req.user });
})

router.get('/books/saved', authMiddleware, getSavedBooksController);
router.post('/books/saved', authMiddleware, saveBookController);

module.exports = router;
