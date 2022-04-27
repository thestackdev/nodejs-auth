import Jsonwebtoken from 'jsonwebtoken'

const { ACCESS_SECRET, RESET_SECRET } = process.env

const createAccessToken = (uid) => {
  return Jsonwebtoken.sign({}, ACCESS_SECRET, {
    expiresIn: '1y',
    issuer: 'fullstacklab.org',
    audience: uid,
  })
}

const verifyAccessToken = (token) => {
  return Jsonwebtoken.verify(token, ACCESS_SECRET)
}

const createPasswordResetToken = (uid) => {
  return Jsonwebtoken.sign({}, RESET_SECRET, {
    expiresIn: '5m',
    issuer: 'fullstacklab.org',
    audience: uid,
  })
}

const verifyPasswordResetToken = (token) => {
  return Jsonwebtoken.verify(token, RESET_SECRET)
}

export default {
  createAccessToken,
  verifyAccessToken,
  createPasswordResetToken,
  verifyPasswordResetToken,
}
