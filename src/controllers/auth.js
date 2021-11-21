import * as Models from '../models/exports.js'
import * as helpers from '../helpers/exports.js'

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    helpers.validateParams({ email, password })
    const user = await Models.User.findOne({ email })
    if (!user) throw { id: 2, email }
    res.send('Login')
  } catch (error) {
    next(error)
  }
}

export const register = async (req, res, next) => {
  try {
    res.send('Register')
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    res.send('resetPassword')
  } catch (error) {
    next(error)
  }
}

export const requestOtp = async (req, res, next) => {
  try {
    res.send('requestOtp')
  } catch (error) {
    next(error)
  }
}

export const verifyOtp = async (req, res, next) => {
  try {
    res.send('verifyOtp')
  } catch (error) {
    next(error)
  }
}
