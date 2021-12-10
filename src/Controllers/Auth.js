import UserModal from '../Models/User.js'
import EmailServices from '../Services/Email.js'
import Helper from '../Helpers/index.js'

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      throw { id: 1, message: 'Missing required fields!' }
    if (!Helper.isEmail(email)) throw { id: 2 }
    if (!Helper.isPassword(password)) throw { id: 4 }

    const user = await UserModal.findOne({ email }).select('+password')
    if (!user) throw { id: 3 }

    const isVerified = await user.verifyPassword(password)
    if (!isVerified) throw { id: 4 }

    if (!user.emailVerified) throw { id: 9, message: user._id }

    const token = Helper.createToken({ _id: user._id })

    res.cookie('token', token, JSON.parse(process.env.CookieOptions)).send('Ok')
  } catch (error) {
    next(error)
  }
}

const Register = async (req, res, next) => {
  try {
    const { email, password, name, username } = req.body
    const user = await UserModal.create({ email, password, name, username })
    res.status(201).send(user._id)
  } catch (error) {
    next(error)
  }
}

const Forgotpassword = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) throw { id: 5 }
    const user = await UserModal.findOne({ email })
    if (!user) throw { id: 3 }
    const token = Helper.createResetToken({ _id: user._id })
    await EmailServices.ResetPassword(user.email, user.name, token)
    res.send('Ok')
  } catch (error) {
    next(error)
  }
}

const ResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body
    if (!token || !password)
      throw { id: 1, message: 'Missing required fields!' }
    const decode = Helper.verifyResetToken(token)
    if (!decode) throw { id: 5 }
    const user = await UserModal.findById(decode._id).select('+password')
    if (!user) throw { id: 6 }

    user.password = password
    await user.save()

    res.send('Ok')
  } catch (error) {
    next(error)
  }
}

const RequestOtp = async (req, res, next) => {
  try {
    const { purpose, _id } = req.body
    if (!purpose || !_id) throw { id: 5 }

    const user = await UserModal.findById(_id)
    if (!user) throw { id: 6 }

    const _Otp = Helper.GenOtp()

    switch (purpose) {
      case 'EmailVerify':
        user.Otp.Purpose = 'EmailVerify'
        await EmailServices.ConfirmEmail(user.email, user.name, _Otp)
        break
      case 'DeleteUser':
        user.Otp.Purpose = 'DeleteUser'
        await EmailServices.DeleteUser(user.email, user.name, _Otp)
        break
      default:
        throw { id: 5 }
    }

    user.Otp.Value = _Otp
    user.Otp.Validity = new Date(Date.now() + 5 * 60 * 1000)
    await user.save()

    res.end()
  } catch (error) {
    next(error)
  }
}

const VerifyOtp = async (req, res, next) => {
  try {
    const { _id, otp, purpose } = req.body
    if (!_id || !otp || !purpose) throw { id: 5 }

    const user = await UserModal.findById(_id)
    if (!user) throw { id: 6 }

    if (otp !== user.Otp.Value) throw { id: 7 }
    if (user.Otp.Validity - Date.now() < 0) throw { id: 8 }

    user.Otp.Value = null
    user.Otp.Validity = null

    switch (purpose) {
      case 'EmailVerify':
        user.emailVerified = true
        const token = Helper.createToken({ _id: user._id })
        await user.save()
        res
          .cookie('token', token, JSON.parse(process.env.CookieOptions))
          .send('Ok')
        break
      case 'DeleteUser':
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

const GetUser = async (req, res, next) => {
  try {
    const user = await UserModal.findById(req._id)
    if (!user) throw { id: 6 }
    res.send({ user })
  } catch (error) {
    next(error)
  }
}

export default {
  Login,
  Register,
  Forgotpassword,
  ResetPassword,
  RequestOtp,
  VerifyOtp,
  GetUser,
}
