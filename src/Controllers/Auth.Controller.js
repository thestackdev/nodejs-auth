import UserModal from '../Models/User.js'
import EmailServices from '../Services/Mailer.js'
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

    const token = tokens.createAccessToken(user.id)
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
    const data = await validator.forgotPasswordSchema.validateAsync(req.body)
    const { email } = data

    const user = await UserModal.findOne({ email }).select('+password')
    if (!user) throw { id: 3 }

    const token = tokens.createPasswordResetToken(user.id)
    await client.set(token, 'Password Reset', {
      EX: 300,
    })

    await EmailServices.ResetPassword(user.email, user.username, token)
    res.send({
      success: true,
      message: 'please check your email',
    })
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const token = req.query.token
    const data = await validator.resetPasswordSchema.validateAsync(req.body)
    const { password } = data

    let cached = await client.GET(token)
    if (!cached) throw { id: 5 }

    const user = await UserModal.findById(req.payload.aud).select('+password')
    if (!user) throw { id: 3 }

    const isOldPassword = await user.verifyPassword(password)

    if (isOldPassword === true) throw { id: 4 }

    user.password = password
    await user.save()

    await client.del(token)

    res.send({
      success: true,
      message: 'password updated successfully',
    })
  } catch (error) {
    next(error)
  }
}

const requestOtp = async (req, res, next) => {
  try {
    const data = await validator.requestOtpSchema.validateAsync(req.body)
    const { reason } = data

    const user = await UserModal.findById(req.payload.aud)
    if (!user) throw { id: 3 }

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    await client.set(req.payload.aud, JSON.stringify({ otp, reason }), {
      EX: 300,
    })

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

    const user = await UserModal.findById(req.payload.aud)
    if (!user) throw { id: 3 }

    let cached = await client.get(req.payload.aud)
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
        await UserModal.findByIdAndDelete(req.payload.aud)
        res.clearCookie('token').send({
          success: true,
          message: 'user deleted successfully',
        })
        return
    }
    await client.del(req.payload.aud)
  } catch (error) {
    next(error)
  }
}

const getUser = async (req, res, next) => {
  try {
    const user = await UserModal.findById(req.payload.aud).select(
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
