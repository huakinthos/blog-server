// 标签
const Tag = require('../model/tag')
const Article = require('../model/Article')
const App = require('./app')

class TagController extends App {
  async getTag (ctx) {
    let { current_page = 1, page_size = 16, keyword = '' } = ctx.query
    let options = {
      sort: { sort: 1 },
      page: Number(current_page),
      limit: Number(page_size)
    }

    let querys = {
      name: new RegExp(keyword)
    }

    let tag = await Tag.paginate(querys, options).catch(err => ctx.throw(500, '服务器内部错误'))
    
    const article = await Article.aggregate([
      { $match },
      { unwind: "$tag" },
      { $group: { _id: "$tag", num_total: { $sum: 1 }}}
    ])
    if (article) {
      tag.forEach(t => {
        const finded = article.find(item => String(item._id) === String(t._id) )
        t.count = finded ? finded.num_total : 0
      })
    }

    if (tag) {
      super.result(ctx, {
        code: 200,
        message: '获取标签列表成功!',
        data: {
          pagination: {
            total: tag.total,
            current_page: tag.page,
            total_page: tag.pages,
            page_size: tag.limit
          },
          list: tag.docs
        }
      })
    } else {
      super.error(ctx, '获取列表失败!')
    }
  }

  async postTag(ctx) {
    let { name, descript } = ctx.request.body

    let res = Tag.find({ name }).catch((err) => super.error(ctx, '服务器错误'))
    if (res && res.length !== 0) {
      super.error(ctx, '已有重复标签')
      return false
    }

    let tag = await new Tag({ name, descript }).save().catch((err) => super.error(ctx, '服务器错误'))
    if (tag) super.success(ctx, '添加标签成功')
    else super.error(ctx, '添加标签失败')
  }

  // 标签排序
  async patchTag(ctx) {
    const { indexs } = ctx.request.body

    try {
      for (let i = 0; i < indexs; i++) {
        await Tag.findByIdAndUpdate(indexs[i], { sort: i + 1 }).catch(err => ctx.throw(500, '服务器内部错误'))
      }
      super.success(ctx, '排序标签成功')
    } catch (error) {
      super.error(ctx, '排序失败')
    }
  }

  async editTag(ctx) {
    const _id = ctx.params.id
    const { name, descript } = ctx.request.body

    const res = await Tag.findByIdAndUpdate(_id, { name, descript }, { new: true })
    if (res) super.result(ctx, {
      code: 200,
      message: '修改标签成功',
      data: res
    })
    else super.error(ctx, '修改标签失败')
  }

  async deleteTag(ctx) {
    const _id = ctx.params.id
    if (!_id) return super.error(ctx, '传入正确的_id')
    let res = await Tag.findByIdAndRemove(_id)
    if (res) super.success(ctx, '删除标签成功')
    else super.error(ctx, '删除标签失败')
  }
}

module.exports = new TagController()
