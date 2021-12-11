import Helpers from '../Helpers/index.js'

const Authorise = (req, res, next) => {
  try {
    const decode = Helpers.verifyToken(req.cookies.token)
    if (!decode) throw { id: 11 }

    req._id = decode._id
    next()
  } catch (error) {
    next(error)
  }
}

export default Authorise
