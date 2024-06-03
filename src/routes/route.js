const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');

const authRoutes = require('./authRoute')
const savedBookRoutes = require('./savedBookRoute')

router.get('/main', authMiddleware, (req,res) => {
  res.json({ message: 'login only bos', user: req.user });
});

authRoutes.forEach(authRoute => {
  router[authRoute.method](authRoute.path, authRoute.controller);
});

savedBookRoutes.forEach(savedBookRoute => {
  router[savedBookRoute.method](savedBookRoute.path, savedBookRoute.middleware, savedBookRoute.controller);
});

module.exports = router;