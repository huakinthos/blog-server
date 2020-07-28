const argv = require('yargs').argv

exports.MONGODB = {
  url: 'mongodb://localhost:27017/blog',
  limit: 16
}

exports.QINIU = {
  accessKey: argv.accessKey || 'BNfhfrvvtUn9MAQecgGTRY6TyQDAKdb5ObjTqwNC',
	secretKey: argv.secretKey || 'fQ-34IVSc6lj5SPbWjtSYL58jmUwXO5kqohKLTfI',
}

exports.SERVER = {
  path: '/api',
  port: 8000
}

exports.EMAIL = {
  user: argv.email_user || '1628331231@qq.com',
  pass: argv.email_pass || 'ysjgowmclqeehaii'
}

exports.AUTH = {
  username: 'shaojiajun',
  password: '123456',
  jwtSecret: 'my_blog'
}