import Joi from 'joi'

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
})

const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
})

const requestOtpSchema = Joi.object({
  reason: Joi.string()
    .lowercase()
    .valid('verify-email', 'delete-user')
    .required(),
})

const verifyOtpSchema = Joi.object({
  otp: Joi.string().length(6).required(),
})

export default {
  loginSchema,
  registerSchema,
  requestOtpSchema,
  verifyOtpSchema,
}
