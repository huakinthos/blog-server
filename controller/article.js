/* 文章控制器 */

const Article = require('../model/Article')
const App = require('./app')
const config = require('../config')
const authVerified = require('../utils/auth')

class ArticleController extends App {
  async getArticleList(ctx) {
    const {
      current_page = 1,
      page_size = 10,
      keyword = '',
      state = 1,
      publish = 1,
      tag,
      type,
      date,
      hot } = ctx.query
    
    const options = {
      sort: { create_time: -1 },
      page: Number(current_page),
      limit: Number(page_size),
      populate: ['tag'],
      select: '-content'
    }

    const querys = {}

    // 关键词查询
    if (keyword) {
      const keywordReg = new RegExp(keyword)
      querys['$or'] = [
        { 'title': keywordReg },
        { 'content': keywordReg },
        { 'description': keywordReg }
      ]
    }

    
    // 按照state查询
    if (['1', '2'].includes(state)) {
      querys.state = state
    }
  
    // 按照公开程度查询
    if (['1', '2'].includes(publish)) {
      querys.publish = publish
    }
  
    // 按照类型程度查询
    if (['1', '2'].includes(type)) {
      querys.type = type
    }

    // 按热度排行
    if (hot) {
      options.sort = {
        'meta.views': -1,
        'meta.likes': -1,
        'meta.comments': -1
      }
    }

    // 时间查询
    if (date) {
      const getDate = new Date(date)
      if(!Object.is(getDate.toString(), 'Invalid Date')) {
        querys.create_time = {
          "$gte": new Date((getDate / 1000 - 60 * 60 * 8) * 1000),
          "$lt": new Date((getDate / 1000 + 60 * 60 * 16) * 1000)
        }
      }
    }

    if (tag) querys.tag = tag

    if (!authVerified(ctx.request)) {
      querys.state = 1
      querys.publish = 1
    }

    const res = await Article.paginate(querys, options).catch(err => console.warn(err, '服务器內部错误'))
    if (res) {
      super.result(ctx, {
        code: 200,
        message: '获取文章列表成功',
        data: {
          pagination: {
            total: res.total,
            current_page: res.page,
            total_page: res.pages,
            page_size: res.limit
          },
          list: res.docs
        }
      })
    } else super.error(ctx, '获取文章列表失败')
  }

  // 添加文章
  async postArticle(ctx) {
    const article = ctx.request.body 
    const res = await new Article(article).save().catch(error => console.error(error, '服务器内部错误'))
    if (res) {
      super.success(ctx, '文章添加成功!')
      // 需要注册网站 在 百度seo推送
    } else super.error(ctx, '文章添加失败')
  }

  // 通过id 查询文章内容
  async getArticle(ctx) {
    const _id = ctx.params.id
    if (!_id) {
      super.error(ctx, '请输入有效id')
    }
    const res = await Article.findById(_id).populate('tag').catch(err => ctx.throw(500, '服务内部错误'))

    if (res) {
      res.meta.views += 1
      res.save()
      super.result(ctx, {
        code: 200,
        message: '获取文章成功!',
        data: res
      })
    } else super.error(ctx, '获取文章失败')
  }

  async deleteArticle(ctx) {
    let _id = ctx.params.id
    if (_id) return super.error(ctx, '请输入正确的id')
    let res = await Article.findByIdAndRemove(_id)
    if (res) super.success(ctx, '删除文章成功') // 百度推送删除
    else super.error(ctx, '删除文章失败')
  }

  async editArticle(ctx) {
    let _id = ctx.params.id
    let { title, keyword, tag } = ctx.request.body

    delete ctx.request.body.create_time
    delete ctx.request.body.update_time
    delete ctx.request.body.meta

    if (!title || !keyword) {
      super.error(ctx, '标题和关键词必须填')
      return false
    }
    const res = await Article.findByIdAndUpdate(_id, ctx.request.body)
    if (res) {
      super.success(ctx, '修改文章内容成功') // 百度推送更新
    } else super.error(ctx, '修改文章失败')
  }

  // 更改文章 状态
  async patchArticle(ctx) {
    let _id = ctx.params.id
    let { state, publish } = ctx.request.body
    let options = {}
    if (state) options.state = state
    if (publish) options.publish = publish

    const res = await Article.findByIdAndUpdate(_id, options)

    if (res) super.success(ctx, '更新状态成功')
    else super.error(ctx, '更新文章状态失败')
  }

  // 归档
  async getArchive(ctx) {
    const page_size = 1000
    const current_page = 1

    const options = {
      sort: { create_time: -1 },
      page: Number(current_page),
      limit: Number(page_size),
      populate: ['tag'],
      select: '-content'
    }

    const querys = {
      state: 1,
      publish: 1
    }

    const article = await Article.aggregate([
      { $match: { state: 1, publish: 1 } },
      { 
        $project: {
          year: { $year: '$create_time'},
          month: { $month: '$create_time' },
          title,
          create_time
        }
      },
      {
        $group: {
          _id: { year: '$year', month: '$month'},
          article: { $push: { _id: '$_id', title: '$title', crate_time: '$create_time' } }
        }
      }
    ])

    if (article) {
      let yearList = [...new Set(article.map(item => item._id.year))]
                      .sort((a, b) => b - a)
                      .map(item => {
                        let monthList = []
                        article.forEach(n => {
                          if (n._id.year === item) {
                            monthList.push({ month: n._id.month, articleList: n.article.reverse() })
                          }
                        })
                        return { year: item, monthList: monthList.sort((a, b) => b.month - a.month)}
                      })
      super.result(ctx, {
        code: 200,
        message: '获取档案成功',
        data: yearList
      })
    } else super.error(ctx, '获取档案失败')
  }
}


module.exports = new ArticleController()