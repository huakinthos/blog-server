const App = require('./app')
const Comment = require('../model/comment')
const Article = require('../model/Article')
const { sendMail } = require('../utils/email')

const sendMailToTarget = (comment, articleLink) => {
  sendMail({
    to: '1628331231@qq.com',
		subject: '博客有新的评论',
		text: `来自 ${comment.author.name} 的留言：${comment.content}`,
		html: `<p> 来自 ${comment.author.name} 的留言：${comment.content}</p><br><a href="${articleLink}" target="_blank">[ 跳转到博客界面 ]</a>`
  })
  // 发送给目标
  /* if (!!comment.pid) {
		Comment.findOne({ id: comment.pid }).then(parentComment => {
			sendMail({
				to: parentComment.author.email,
				subject: '你在jkchao.cn有新的评论回复',
				text: `来自 ${comment.author.name} 的评论回复：${comment.content}`,
				html: `<p> 来自${comment.author.name} 的评论回复：${comment.content}</p><br><a href="${articleLink}" target="_blank">[ 点击查看 ]</a>`
			})
		})
	} */
}

// 更新文章评论
const updateCount = (refer_ids = []) => {
  refer_ids = [...new Set(refer_ids)].filter(id => !!id) // id去重
  if (refer_ids.length) {
    Comment.aggregate([
      { $match: { refer_id: { $in: refer_ids} } },
      { $group: { _id: "$refer_id", num_total: { $sum: 1} } } // { _id: "refer_id", num_total: x}
    ]).then(counts => {
      console.log(counts)
      if (counts.length === 0) {
        Article.update({ id: refer_ids[0] }, { $set: { 'meta.comments': 0 }})
      } else {
        counts.forEach(count => {
          Article.update({ id: count._id }, { $set: { 'meta.comments': count.num_total }})
        })
      }
    }).catch(err => {
      console.warn('更新文章评论聚合查询失败', err)
    })
  }
}

class commentController extends App {
  async getCommentList(ctx) {
    let { sort = -1, current_page = 1, page_size = 20, keyword = '', refer_id } = ctx.query
    sort = Number(sort)
    // 过滤
    let options = {
      sort: { _id: sort },
      page: Number(current_page),
      limit: Number(page_size)
    }

    // 排序 2 是按点赞数倒叙
    if ([1, -1].includes(sort)) {
      options.sort = { _id: sort }
    } else {
      options.sort = { like: -1 }
    }

    // 查询参数
    let querys = {}

    console.log(keyword)
    if (keyword) {
      const keywordReg = new RegExp(keyword)
      querys['$or'] = [
        { 'content': keywordReg },
				{ 'author.name': keywordReg },
				{ 'author.email': keywordReg }
      ]
    }

    if (!Object.is(refer_id, undefined)) {
      querys.refer_id = refer_id
    }

    let res = await Comment.paginate(querys, options).catch(err => ctx.throw(500, '服务器异常'))
    if (res) {
      super.result(ctx, {
        code: 200,
        message: '获取评论列表成功!',
        data: {
          pagination: {
            total: res.total,
            current_page: options.page,
            total_page: res.pages,
            page_size: options.limit
          },
          list: res.docs
        }
      })
    } else super.error(ctx, '读取评论列表失败...')
  }
  // 发布评论
  async postComment(ctx) {
    let comment = ctx.request.body // pid, refer_id, content, author
    comment.like = 0
    comment.author = JSON.parse(comment.author)

    // 生成文章的链接，以便邮件发送后有refer_id
    /* let articleLink
    if (Number(comment.refer_id) !== 0) {
      const article = await Article.findOne({ id: comment.refer_id }, '_id')
      articleLink = `http://localhost:3000/article/${article._id}`
    } else articleLink = 'http://localhost:3000/about' */

    let res = await new Comment(comment).save()
    if (res) {
      super.result(ctx, {
        code: 200,
        message: '发布评论成功',
        data: res
      })
      // 更新聚合 并 发送邮件
      // sendMailToTarget(res, articleLink)
      updateCount([res.refer_id])
    } else super.error(ctx, '评论发布失败, 请重试!')
  }
  // 删除评论
  async delComment(ctx) {
    const _id = ctx.params.id
    
    // 删除文章refer_ids 的相关
    const refer_ids = Array.of(Number(ctx.query.refer_ids))

    let res = await Comment.findOneAndRemove(_id).catch(err => ctx.throw(500, '服务器异常'))
    if (res) {
      super.success(ctx, '删除评论成功')
      updateCount(refer_ids)
    } else {
      super.error(ctx, '删除评论失败')
    }
  }

  // 修改评论
  async editCommnet(ctx) {
    const _id = ctx.params.id
    let { refer_ids, author } = ctx.request.body

    if (!refer_ids) {
      ctx.throw(401, '参数无效')
      return false
    }

    if (author) author = JSON.parse(author)

    const res = await Comment.findByIdAndUpdate(_id, { ...ctx.request.body, author })
    if (res) {
      super.result(ctx, {
        code: 200,
        message: '修改评论成功',
        data: res
      })
      updateCount(refer_ids)
    } else super.error(ctx, '修改失败')
  }
}

module.exports = new commentController()