import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import Helper from '../helpers/index.js'

const User = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      lowercase: [true, 'username must be lowercase!'],
      required: [true, 'username is required!'],
      unique: [true, 'username already taken!'],
      minlength: [3, 'username must be atleast 3 characters!'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'email is required!'],
      unique: [true, 'email already taken!'],
      validate: {
        validator: Helper.isEmail,
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      trim: true,
      select: false,
      required: [true, 'password is required!'],
      minlength: [6, 'password must be atleast 6 characters!'],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      reason: {
        type: String,
        enum: ['verify-email', 'reset-password', 'delete-user'],
      },
      value: String,
      expireAt: Date,
    },
  },
  { timestamps: true }
)

User.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcryptjs.hash(this.password, 6)
})

User.methods.verifyPassword = function (password) {
  return bcryptjs.compare(password, this.password)
}

export default mongoose.model('User', User, 'Users')
