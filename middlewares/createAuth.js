// 第一次开启服务器的用户创建
const Auth = require('../model/Auth')
const crypto = require('crypto')
const config = require('../config')

const md5Decode = pwd => {
  return crypto
            .createHash('md5')
            .update(pwd)
            .digest('hex')
}

module.exports = async (ctx, next) => {
  const username = config.AUTH.username
  const password = md5Decode(config.AUTH.password)
  let res = await Auth.find().exec()
  if (res.length === 0) {
    let auth = new Auth({ username, password })
    auth.save().catch(err => ctx.throw(500, '服务器发生错误，创建管理员失败'))
    console.log('创建管理员成功')
  }
  await next()
}
