import { Router } from 'express'
import * as route from './exports.js'

const router = Router()

router.use('/auth', route.auth)

export default router
