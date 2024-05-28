const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers
  
  if(!authorization){
    return res.status(401).json({
      message: 'no Token'
    })
  }

  const token = authorization.split(' ')[1]
  const secret = process.env.JWT_SECRET_KEY

  try {
    const jwtDecode = jwt.verify(token, secret);
    req.user = jwtDecode;
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized'
    })
  }
  next()
}

module.exports = authMiddleware;