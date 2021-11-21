import { Router } from 'express'
import * as auth from '../controllers/auth.js'

const router = Router()

router.post('/login', auth.login)
router.post('/register', auth.register)
router.post('/resetpassword', auth.resetPassword)
router.post('/requestotp', auth.requestOtp)
router.post('/verifyotp', auth.verifyOtp)

export default router
