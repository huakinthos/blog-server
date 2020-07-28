const mongoose = require('../db').mongoose
const config = require('../config')
const crypto = require('crypto')

const authSchema = new mongoose.Schema({
  // 昵称
  name: { type: String, default: '' },
  username: { type: String, default: config.AUTH.username },
  password: { type: String, default: crypto.createHash('md5').update(config.AUTH.password).digest('hex')},
  slogan: { type: String, default: '这个人很懒, 没有签名...'},
  avatar: { type: String, default: '' }
})

let Auth = mongoose.model('Auth', authSchema)

module.exports = Auth