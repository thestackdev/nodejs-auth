import UserModal from '../models/User.js'
import EmailServices from '../services/email.js'
import Helper from '../helpers/index.js'
import constants from '../constants.js'
import Joi from 'joi'

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) throw { id: 1 }
    if (!Helper.isEmail(email)) throw { id: 2 }
    if (!Helper.isPassword(password)) throw { id: 4 }

    const user = await UserModal.findOne({ email }).select('+password')
    if (!user) throw { id: 3 }

    const isVerified = await user.verifyPassword(password)
    if (!isVerified) throw { id: 4 }

    if (!user.emailVerified) throw { id: 9, message: user._id }

    const token = Helper.createToken(user._id, process.env.JWT_SECRET)

    res.cookie('token', token, { ...constants.cookieOptions }).send('Ok')
  } catch (error) {
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body
    const user = await UserModal.create({ email, password, username })
    res.status(201).send(user._id)
  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) throw { id: 1 }
    const user = await UserModal.findOne({ email })
    if (!user) throw { id: 3 }
    const token = Helper.createToken(user._id, process.env.RESET_SECRET)
    await EmailServices.ResetPassword(user.email, user.username, token)
    res.send('Ok')
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body
    if (!token || !password) throw { id: 1 }
    const decode = Helper.verifyToken(token, process.env.RESET_SECRET)
    if (!decode) throw { id: 5 }
    const user = await UserModal.findById(decode._id).select('+password')
    if (!user) throw { id: 3 }

    user.password = password
    await user.save()

    res.send('Ok')
  } catch (error) {
    next(error)
  }
}

const requestOtp = async (req, res, next) => {
  try {
    const { reason, _id } = req.body
    if (!reason || !_id) throw { id: 1 }

    const user = await UserModal.findById(_id)
    if (!user) throw { id: 3 }

    const _Otp = Helper.GenOtp()

    switch (reason) {
      case 'verify-email':
        user.otp.reason = 'verify-email'
        await EmailServices.ConfirmEmail(user.email, user.username, _Otp)
        break
      case 'delete-user':
        user.otp.reason = 'delete-user'
        await EmailServices.DeleteUser(user.email, user.username, _Otp)
        break
      default:
        throw { id: 5 }
    }

    user.otp.value = _Otp
    user.otp.expireAt = new Date(Date.now() + 5 * 60 * 1000)
    await user.save()

    res.end()
  } catch (error) {
    next(error)
  }
}

const verifyOtp = async (req, res, next) => {
  try {
    const { _id, otp, reason } = req.body
    if (!_id || !otp || !reason) throw { id: 5 }

    const user = await UserModal.findById(_id)
    if (!user) throw { id: 3 }

    if (otp !== user.otp.value) throw { id: 7 }
    if (user.otp.expireAt - Date.now() < 0) throw { id: 8 }

    user.otp.value = null
    user.otp.expireAt = null

    switch (reason) {
      case 'verify-email':
        user.emailVerified = true
        const token = Helper.createToken(user._id, process.env.JWT_SECRET)
        await user.save()
        res.cookie('token', token, { ...constants.cookieOptions }).send('Ok')
        break
      case 'delete-user':
        await UserModal.findByIdAndDelete(_id)
        res.clearCookie('token').send('Ok')
        return

      default:
        throw { id: 5 }
    }
  } catch (error) {
    next(error)
  }
}

const getUser = async (req, res, next) => {
  try {
    const user = await UserModal.findById(req._id).select(
      '_id , username , email'
    )
    if (!user) throw { id: 3 }
    res.send(user)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    res
      .cookie('token', null, { ...constants.cookieOptions, maxAge: 1 })
      .send('Ok')
  } catch (error) {
    next(error)
  }
}

export default {
  login,
  register,
  forgotPassword,
  resetPassword,
  requestOtp,
  verifyOtp,
  getUser,
  logout,
}
