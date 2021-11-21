import express from 'express'
import mongoose from 'mongoose'
import router from './router/index.js'
import * as middleware from './middleware/exports.js'
const app = express()

mongoose.connect(process.env.MONGO_URL, process.env.MONGO_CONFIG)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)
app.use(middleware.error)
app.use(middleware.handler)

app.listen(process.env.PORT)
