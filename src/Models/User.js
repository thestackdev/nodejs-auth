import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const User = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      minlength: 3,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      select: false,
      required: true,
      minlength: 6,
    },
    emailVerified: {
      type: Boolean,
      default: false,
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
