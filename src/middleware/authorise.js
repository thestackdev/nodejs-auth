import Helpers from '../helpers/index.js'

const Authorise = (req, res, next) => {
  try {
    const decode = Helpers.verifyToken(
      req.cookies.token,
      process.env.JWT_SECRET
    )
    if (!decode) throw { id: 11 }

    req._id = decode._id
    next()
  } catch (error) {
    next(error)
  }
}

export default Authorise
