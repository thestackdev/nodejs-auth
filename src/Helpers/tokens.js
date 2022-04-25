import Jsonwebtoken from 'jsonwebtoken'

const createToken = (_id, secret) => {
  return Jsonwebtoken.sign({ _id }, secret)
}

const verifyToken = (token, secret) => {
  return Jsonwebtoken.verify(token, secret)
}

export default { createToken, verifyToken }
