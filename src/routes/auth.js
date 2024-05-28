const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/authUsers')

// Registrasi pengguna
router.post('/register', register);

// Login pengguna
router.post('/login', login);

module.exports = router;
