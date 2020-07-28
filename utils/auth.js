/* auth 认证*/
const config = require('../config')
const jwt = require('jsonwebtoken')

const authToken = req => {
  if (req.header && req.header.authorization) {
    const parts = req.headers.authorization.split(' ')
		if (Object.is(parts.length, 2) && Object.is(parts[0], 'Bearer')) {
			return parts[1]
		}
  }
  return false
}

const authVerified = req => {
  let token = authToken(req)
  if (token) {
    try {
      const decodedToken = jwt.verify(token, config.AUTH.jwtSecret)
      if (decodedToken.exp > Math.floor(Date.now() / 1000)) {
        return true
      }
    } catch (error) {
      console.log(error)
    }
  }
  return false
}

module.exports = authVerified