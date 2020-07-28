const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const config = require('../config')
let isConncet = false

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: "smtp.qq.com",
    secure: true,
    port: 465,
    auth: {
      user: config.EMAIL.user,
      pass: config.EMAIL.pass
    }
  })
)

const verifyClient = () => {
  transporter.verify((err, success) => {
    if (err) {
      isConncet = false
      console.warn('邮件客户端连接失败，请重试!')
    } else {
      isConncet = true
      console.log('邮件客户端连接成功了!')
    }
  })
}

verifyClient()

/* let mailOptions = {
  from: '"白小明" <80583600@qq.com>', // 发件人
  to: 'xx1@qq.com, xx2@qq.com', // 收件人
  subject: 'Hello ✔', // 主题
  text: '这是一封来自 Node.js 的测试邮件', // plain text body
  html: '<b>这是一封来自 Node.js 的测试邮件</b>', // html body
  // 下面是发送附件
  attachments: [{
          filename: 'test.md',
          path: './test.md'
      },
      {
          filename: 'content',
          content: '发送内容'
      }
  ]
} */

const sendMail = (mailOptions) => {
  if (!isConncet) {
    console.warn('发送邮件失败, 客户端未连接')
    return false
  }

  mailOptions.from = '"sjj" <1628331231@qq.com>'
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('邮件发送失败: ', error)
    }
    console.log(`Message: ${info.messageId}`)
    console.log(`sent: ${info.response}`)
  })
}

exports.sendMail = sendMail
exports.nodemailer = nodemailer
exports.transporter = transporter