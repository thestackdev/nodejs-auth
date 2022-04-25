import tokens from '../Helpers/tokens.js'
import User from '../Models/User.js'

const verifyAccess = (req, res, next) => {
  try {
    if (!req.cookies.token) throw { id: 5 }
    const decode = tokens.verifyToken(
      req.cookies.token,
      process.env.TOKEN_SECRET
    )
    if (!decode) throw { id: 11 }

    req._id = decode._id
    next()
  } catch (error) {
    next(error)
  }
}

const checkEmailVerified = async (req, res, next) => {
  try {
    const user = await User.findById(req._id)
    if (!user) throw { id: 3 }

    if (user.emailVerified !== true) throw { id: 9 }
    next()
  } catch (error) {
    next(error)
  }
}

export default { verifyAccess, checkEmailVerified }
