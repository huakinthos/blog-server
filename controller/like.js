const Article = require('../model/Article')
const Comment = require('../model/comment')
const App = require('./app')

class LikeController extends App {
  async postLike (ctx) {
    const { _id, type } = ctx.request.body 
    if (!_id || !type || ![0, 1].includes(Number(type))) {
      super.error(ctx, '传递无效参数')
      return false
    }

    // type = 0 文章 tyoe = 1 评论
    const res = await (Number(type) === 0 ? Article : Comment).findById(_id)

    if (res) {
      if (Number(type) === 0) res.meta.likes += 1
      else res.likes += 1
      const info = await res.save()
      if (info) super.result(ctx, {
        code: 200,
        message: '点赞成功',
        data: info
      })
      else super.error(ctx, '点赞失败')
    } super.error(ctx, '点赞失败')
  }
}

module.exports = new LikeController()