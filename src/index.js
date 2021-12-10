import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import AuthRouter from './Router/Auth.js'
import ErrorMiddleware from './Middleware/Error.js'

const app = express()

mongoose.connect(
  process.env.MONGO_URL,
  {
    ...JSON.parse(process.env.MONGO_CONFIG),
  },
  (err) => {
    console.log(process.env.MONGO_URL)
    if (err) console.log('Mongodb Connection failed')
    else console.log('Mongodb Connection succeed!')
  }
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({ origin: process.env.ORIGIN, credentials: true }))

app.use('/auth', AuthRouter)

app.use(ErrorMiddleware)

app.use((req, res) => {
  res.status(400).send('No route found!')
})

app.listen(process.env.PORT)
