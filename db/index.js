const mongoose = require('mongoose')
const config = require('../config')

mongoose.Promise = global.Promise

exports.connect = () => {
  mongoose.set('useCreateIndex', true)
  
  mongoose.connect(config.MONGODB.url, { useNewUrlParser: true, useUnifiedTopology: true })

  mongoose.connection.on('error', (error) => {
    console.log('db connect fail', error)
  })

  mongoose.connection.once('open', () => {
    console.log('db connect success!')
  })

  return mongoose
}

exports.mongoose = mongoose