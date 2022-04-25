import mongoose from 'mongoose'

mongoose.connect(process.env.MongoUrl, {
  dbName: process.env.NODE_ENV,
  authSource: 'admin',
})

mongoose.connection.on('connected', () => {
  console.log('Mongodb connection succeed')
})

mongoose.connection.on('error', (err) => {
  console.log(`Mongodb connection failed ${err.message}`)
})
