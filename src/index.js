import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import AuthRouter from './router/auth.js'
import ErrorMiddleware from './middleware/error.js'
import constants from './constants.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({ origin: constants.origin, credentials: true }))

app.use('/', AuthRouter)
app.use(ErrorMiddleware)

app.use((req, res) => {
  res.status(400).send('No route found!')
})

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MongoUrl)
    console.log('DB connection succeed!')
  } catch (error) {
    console.log('DB connection failed', error)
  }
}

app.listen(process.env.PORT)
connectdb()
