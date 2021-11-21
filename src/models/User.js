import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import * as helpers from '../helpers/exports.js'

const User = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required!'],
    minlength: [6, 'name must be atleast 6 characters!'],
  },
  username: {
    type: String,
    lowercase: [true, 'username must be lowercase!'],
    required: [true, 'username is required!'],
    unique: [true, 'username already taken!'],
    minlength: [3, 'username must be atleast 3 characters!'],
  },
  email: {
    type: String,
    required: [true, 'email is required!'],
    unique: [true, 'There is already an account with this email!'],
    validate: {
      validator: helpers.isEmail,
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: [true, 'password is required!'],
    minlength: [6, 'password must be atleast 6 characters!'],
  },
})

User.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcryptjs.hash(this.password, 6)
})

export default mongoose.model('User', User, 'Users')
