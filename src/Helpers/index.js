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

const createToken = (payload) => {
  return Jsonwebtoken.sign(payload, process.env.JWT_SECRET)
}

const createResetToken = (payload) => {
  return Jsonwebtoken.sign(payload, process.env.RESET_SECRET)
}

const verifyToken = (payload) => {
  return Jsonwebtoken.verify(payload, process.env.JWT_SECRET)
}

const verifyResetToken = (payload) => {
  return Jsonwebtoken.verify(payload, process.env.RESET_SECRET)
}

export default {
  createToken,
  createResetToken,
  verifyToken,
  verifyResetToken,
  GenOtp,
  isEmail,
  isPassword,
}
