import Helpers from '../Helpers/index.js'

const Authorise = (req, res, next) => {
  try {
    const decode = Helpers.verifyToken(req.cookies.token)
    if (decode) {
      req._id = decode
      next()
    }
  } catch (error) {
    next(error)
  }
}

export default Authorise
