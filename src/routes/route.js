const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');

const authRoutes = require('./authRoute')
const savedBookRoutes = require('./savedBookRoute');
const recommendationsRoute = require('./recommendationsRoute');
const profileRoute = require('./profileRoute');

router.get('/main', authMiddleware, (req,res) => {
  res.json({ message: 'login only bos', user: req.user });
});

authRoutes.forEach(route => {
  router[route.method](route.path, route.controller);
});

savedBookRoutes.forEach(route => {
  router[route.method](route.path, route.middleware, route.controller);
});

recommendationsRoute.forEach(route => {
  router[route.method](route.path, route.middleware, route.controller);
});

profileRoute.forEach(route => {
  router[route.method](route.path, route.middleware, route.controller);
});

module.exports = router;