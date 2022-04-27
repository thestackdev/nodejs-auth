import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import AuthRouter from './Router/Auth.Router.js'
import ErrorMiddleware from './Middleware/error.js'
import constants from './constants.js'
import './Helpers/mongodb.js'
import './Helpers/redis.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({ origin: constants.origin, credentials: true }))

app.use('/', AuthRouter)
app.use(ErrorMiddleware)

app.use((req, res) => {
  res.status(400).send('Invalid Route!')
})

app.listen(process.env.PORT)
