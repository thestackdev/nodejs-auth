import Jsonwebtoken from 'jsonwebtoken'

const GenOtp = () => {
  let OTP = ''
  for (let i = 0; i < 6; i++) {
    OTP += Math.round(Math.random() * 9).toString()
  }
  return OTP
}

const isEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

const isPassword = (password) => {
  return password.length >= 6
}

const createToken = (_id, token) => {
  return Jsonwebtoken.sign({ _id }, token)
}

const verifyToken = (token, secret) => {
  return Jsonwebtoken.verify(token, secret)
}

export default {
  createToken,
  verifyToken,
  GenOtp,
  isEmail,
  isPassword,
}
