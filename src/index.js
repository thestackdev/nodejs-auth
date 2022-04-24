import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import AuthRouter from './router/auth.js'
import ErrorMiddleware from './middleware/error.js'
import constants from './constants.js'

const app = express()
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({ origin: constants.origin, credentials: true }))

app.use('/', AuthRouter)
app.use(ErrorMiddleware)

app.use((req, res) => {
  res.status(400).send('Invalid Route!')
})

const connectdb = async () => {
  const mongourl =
    process.env.NODE_ENV === 'dev'
      ? process.env.Mongo_dev
      : process.env.Mongo_prod
  console.log(mongourl)
  console.log(process.env.NODE_ENV === 'dev')
  try {
    await mongoose.connect(mongourl)
    console.log('DB connection succeed!')
  } catch (error) {
    console.log('DB connection failed', error)
  }
}

const port = process.env.NODE_ENV === 'dev' ? 5000 : process.env.PORT

app.listen(port)
connectdb()
