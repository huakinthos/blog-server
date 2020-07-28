const Site = require('../model/Site')
const App = require('./app')

class SiteController extends App {
  // 获取网站信息
  async getSite(ctx) {
    const site = await Site.findOne()
    if (site) {
      super.result(ctx, {
      code: 200,
      msg: '获取网站信息成功',
      data: site
      })
    } else super.error(ctx, '获取网站信息失败')
  }

  // 修改网站信息
  async editSite(ctx) {
    const _id = ctx.request.body._id
    const res = await _id ? Site.findByIdAndUpdate(_id, ctx.request.body, { new: true }) : new Site(ctx.request.body).save() 
    if (res) {
      super.result(ctx, {
      code: 200,
      msg: '修改信息成功',
      data: res._id
      })
    } else super.error(ctx, '修改信息失败')
  }
}

module.exports = new SiteController()