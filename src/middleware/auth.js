const fs = require('fs');
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers
  
  if(!authorization){
    return res.status(401).json({
      message: 'please login first'
    })
  }

  const token = authorization.split(' ')[1]

  try {
    const jwtDecode = jwt.verify(token, JWT_SECRET.toString());
    req.user = jwtDecode;
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized'
    })
  }
  next();
}

module.exports = authMiddleware;