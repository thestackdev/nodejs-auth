const options = {
  success: false,
  message: 'Internal server error',
}
let status = 500

const error = (error, req, res, next) => {
  const _error = error.name || error.id
  switch (_error) {
    case 'ValidationError':
      status = 422
      options.message = 'validation Error'
      break
    case 3:
      status = 401
      options.message = 'email/password does not match'
      break
    case 5:
      status = 400
      options.message = 'bad request'
      break
    case 7:
      status = 401
      options.message = 'otp mismatch'
      break
    case 8:
      status = 401
      options.message = 'otp expired'
      break
    case 9:
      status = 401
      options.message = 'Please confirm your email to continue'
      break
    case 'MongoServerError':
      status = 401
      if (error.code === 11000)
        if (error.keyValue.username) options.message = 'username already taken'
        else if (error.keyValue.email) options.message = 'email already taken'
      break
    case 'TokenExpiredError':
      status = 400
      options.message = 'session expired'
      break
    default:
      console.log(error)
      break
  }

  res.status(status).send(options)
}

export default error
