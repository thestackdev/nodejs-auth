import tokens from '../Helpers/tokens.js'
import User from '../Models/User.js'

const verifyAccess = (req, res, next) => {
  try {
    if (!req.cookies.token) throw { id: 6 }
    const decode = tokens.verifyAccessToken(req.cookies.token)
    req.payload = decode
    next()
  } catch (error) {
    next(error)
  }
}

const verifyPasswordResetAccess = async (req, res, next) => {
  try {
    if (!req.query.token) throw { id: 6 }
    const decode = tokens.verifyPasswordResetToken(req.query.token)
    req.payload = decode
    next()
  } catch (error) {
    next(error)
  }
}

const checkEmailVerified = async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.aud)
    if (!user) throw { id: 6 }

    if (user.emailVerified !== true) throw { id: 9 }
    next()
  } catch (error) {
    next(error)
  }
}

export default { verifyAccess, checkEmailVerified, verifyPasswordResetAccess }
