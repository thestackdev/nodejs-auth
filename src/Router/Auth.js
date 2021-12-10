import { Router } from 'express'
import AuthController from '../Controllers/Auth.js'
import Authorise from '../Middleware/Authorise.js'

const router = Router()

router.post('/login', AuthController.Login)
router.post('/register', AuthController.Register)
router.post('/forgotpassword', AuthController.Forgotpassword)
router.post('/resetpassword', AuthController.ResetPassword)
router.post('/requestotp', AuthController.RequestOtp)
router.post('/verifyotp', AuthController.VerifyOtp)
router.get('/verifyToken', Authorise, AuthController.GetUser)

export default router
