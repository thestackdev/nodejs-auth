import { Router } from 'express'
import authController from '../Controllers/Auth.Controller.js'
import authorise from '../Middleware/authorise.js'

const router = Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/forgot_password', authController.forgotPassword)
router.post(
  '/reset_password',
  authorise.verifyPasswordResetAccess,
  authController.resetPassword
)
router.post('/request_otp', authorise.verifyAccess, authController.requestOtp)
router.post('/verify_otp', authorise.verifyAccess, authController.verifyOtp)
router.get(
  '/user',
  authorise.verifyAccess,
  authorise.checkEmailVerified,
  authController.getUser
)
router.get('/logout', authorise.verifyAccess, authController.logout)

export default router
