const error = (error, req, res, next) => {
  if (error.name) resolveId(error)
  switch (error.id) {
    case 1:
      res.status(400).send('Missing required fields')
      break
    case 2:
      res.status(400).send({ email: 'email malformatted' })
      break
    case 3:
      res.status(404).send({ email: 'No user found' })
      break
    case 4:
      res.status(400).send({ password: 'Wrong password' })
      break
    case 5:
      res.status(400).send('Invalid Reason')
      break
    case 6:
      res.status(403).send(error.message)
      break
    case 7:
      res.status(403).send('Wrong Otp!')
      break
    case 8:
      res.status(403).send('Otp Expired!')
      break
    case 9:
      res.status(401).send({ email: 'Email Unverified', _id: error.message })
      break
    case 11:
      res.status(403).send('Unauthorised')
      break
    case 12:
      res.status(403).send({ reason: 'Session Expired' })
      break
    default:
      console.log(error)
      res.status(500).send('Something went wrong!')
      break
  }
}

const resolveId = (error) => {
  console.log(error)
  switch (error.name) {
    case 'ValidationError':
      let message = []
      for (let i in error.errors) {
        message.push({ [i]: error.errors[i].properties.message })
      }
      error.message = message
      error.id = 6
      break
    case 'MongoServerError':
      error.id = 6
      if (error.code === 11000) {
        if (error.keyValue.username)
          error.message = { username: 'Username already taken' }
        else if (error.keyValue.email)
          error.message = { email: 'Email already taken' }
      }
      break
    case 'JsonWebTokenError':
      error.id = 11
      break
    case 'TokenExpiredError':
      error.id = 12
      break
    case 'CastError':
      error.id = 1000
      break
    case 'SyntaxError':
      error.id = 1000
      break
    default:
      break
  }
  return error
}

export default error
