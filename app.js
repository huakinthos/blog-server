const Koa = require('koa')
const app = new Koa()
const http = require('http')
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const mongoosePaginate = require('mongoose-paginate')
const config = require('./config')
const router = require('./routes')
const mongodb = require('./db')
const interceptorMiddle = require('./middlewares/interceptor')

mongodb.connect()

mongoosePaginate.paginate.options = {
  limit: config.MONGODB.limit
}

app.use(interceptorMiddle)

app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

/* app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    ctx.body = {
      code: 0,
      message: 'koa服务器内部出错了!'
    }
    if (ctx.status === 404 || ctx.status === 405) {
      ctx.body = {
        code: 0,
        message: '调用api无效'
      }
    }
  }
}) */

app.use(router.routes(), router.allowedMethods())

http.createServer(app.callback()).listen(config.SERVER.port, () => {
  console.log(`server run at http://localhost:${config.SERVER.port}`)
})