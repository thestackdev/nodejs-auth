import UserModal from '../Models/User.js'
import EmailServices from '../Services/email.js'
import tokens from '../Helpers/tokens.js'
import constants from '../constants.js'
import validator from '../Helpers/validator.js'
import client from '../Helpers/redis.js'
import otpGenerator from 'otp-generator'

const login = async (req, res, next) => {
  try {
    const data = await validator.loginSchema.validateAsync(req.body)
    const { email, password } = data

    const user = await UserModal.findOne({ email }).select('+password')
    if (!user) throw { id: 3 }

    const passwordMatch = await user.verifyPassword(password)
    if (!passwordMatch) throw { id: 3 }

    const token = tokens.createToken(user._id, process.env.TOKEN_SECRET)
    res.cookie('token', token, { ...constants.cookieOptions }).send({
      success: true,
    })
  } catch (error) {
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const data = await validator.registerSchema.validateAsync(req.body)
    await UserModal.create(data)
    res.status(201).send({
      success: true,
    })
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
    const token = tokens.createToken(user._id, process.env.RESET_SECRET)
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
    const decode = tokens.verifyToken(token, process.env.RESET_SECRET)
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
    const data = await validator.requestOtpSchema.validateAsync(req.body)
    const { reason } = data

    const user = await UserModal.findById(req._id)
    if (!user) throw { id: 3 }

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    await client.set(req._id, JSON.stringify({ otp, reason }), { EX: 300 })

    switch (reason) {
      case 'verify-email':
        if (user.emailVerified !== true) {
          await EmailServices.ConfirmEmail(user.email, user.username, otp)
        } else throw { id: 5 }
        break
      case 'delete-user':
        await EmailServices.DeleteUser(user.email, user.username, otp)
        break
      default:
    }

    res.send({
      success: true,
      message: 'please check your email',
    })
  } catch (error) {
    next(error)
  }
}

const verifyOtp = async (req, res, next) => {
  try {
    const data = await validator.verifyOtpSchema.validateAsync(req.body)
    const { otp } = data

    const user = await UserModal.findById(req._id)
    if (!user) throw { id: 3 }

    let cached = await client.get(req._id)
    if (!cached) throw { id: 8 }
    else cached = JSON.parse(cached)

    if (cached.otp !== otp) throw { id: 7 }

    switch (cached.reason) {
      case 'verify-email':
        user.emailVerified = true
        await user.save()
        res.send({
          success: true,
          message: 'email successfully verified',
        })
        break
      case 'delete-user':
        await UserModal.findByIdAndDelete(req._id)
        res.clearCookie('token').send({
          success: true,
          message: 'user deleted successfully',
        })
        return
    }
    await client.del(req._id)
  } catch (error) {
    next(error)
  }
}

const getUser = async (req, res, next) => {
  try {
    const user = await UserModal.findById(req._id).select(
      '_id , username , email , emailVerified'
    )
    if (!user) throw { id: 3 }
    res.send(user)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    res.cookie('token', null, { ...constants.cookieOptions, maxAge: 1 }).send({
      success: true,
      message: 'successfully logged out',
    })
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
