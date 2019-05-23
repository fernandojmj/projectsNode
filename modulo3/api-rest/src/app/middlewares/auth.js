const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const autHeader = req.headers.authorization

  if (!autHeader) {
    return res.status(401).json({ error: 'não existe token' })
  }

  const [, token] = autHeader.split(' ')
  console.log(token)
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)
    req.userId = decoded.id
    console.log(decoded)
    return next()
  } catch (error) {
    return res.status(401).json({ error: 'token invalido' })
  }
}
