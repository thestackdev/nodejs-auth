import { Router } from 'express'
import authController from '../controllers/auth.js'
import Authorise from '../middleware/authorise.js'

const router = Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/forgotpassword', authController.forgotPassword)
router.post('/resetpassword', authController.resetPassword)
router.post('/requestotp', authController.requestOtp)
router.post('/verifyotp', authController.verifyOtp)
router.get('/verifytoken', Authorise, authController.getUser)
router.get('/logout', Authorise, authController.login)

export default router
