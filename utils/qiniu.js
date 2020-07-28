// get qiniu token
const qiniu = require('qiniu')
const config = require('../config')

const access = config.QINIU.accessKey
const secret = config.QINIU.secretKey

const mac = new qiniu.auth.digest.Mac(access, secret)

