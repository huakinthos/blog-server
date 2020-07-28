// 留言墙
const Leave = require('../model/leave')
const App = require('./app')
const { sendMail } = require('../utils/email')
const geoip = require('geoip-lite')

class LeaveController extends App {
  // 获取
  async getLeave(ctx) {
    let { current_page = 1, page_size = 12, keyword = '', state = '' } = ctx.query
    // 过滤
    const options = {
      sort: { _id: -1 },
      page: Number(current_page),
      size: Number(page_size)
    }
    
    // 查询参数
    const querys = {
      name: new RegExp(keyword)
    }

    // 审核状态
    if (["0", "1", "2"].includes(state)) {
      querys.state = Number(state)
    }

    const res = await Leave.paginate(querys, options)
    if (res) {
      super.result(ctx, {
        code: 200,
        message: '获取留言成功!',
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
    } else super.error(ctx, '获取留言数据失败')

  }

  // 发布
  async postLeave(ctx) {
    let leave = ctx.request.body

    // 获取ip地址以及物理地理地址
    const ip = (ctx.req.headers['x-forwarded-for'] || 
    ctx.req.headers['x-real-ip'] || 
    ctx.req.connection.remoteAddress || 
    ctx.req.socket.remoteAddress ||
    ctx.req.connection.socket.remoteAddress ||
    ctx.req.ip ||
    ctx.req.ips[0]).replace('::ffff:', '');

    leave.ip = ip
    leave.state = 0
    leave.agent = ctx.headers['user-agent'] || leave.agent

    // 通过ip解析地址
    const ip_location = geoip.lookup(ip)

    if (ip_location) {
      leave.city = ip_location.city
      leave.range = ip_location.range
      leave.country = ip_location.country
    }

    const res = new Leave(leave).save()
    if (res) {
      super.result(ctx, {
        code: 200,
        message: '发表留言成功, 请等待内容审核'
      })
      sendMail({
        to: '1628331231@qq.com',
        subject: '博客有新的留言',
        text: `来自 ${leave.name} 的留言：${leave.content}`,
        html: `<p> 来自 ${leave.name} 的留言：${leave.content}</p>`
      })
    } else {
      super.error(ctx, '提交留言失败..')
    }
  }

  // 删除
  async deleteLeave(ctx) {
    let _id = ctx.parmas.id

    if (!_id) {
      super.error(ctx, '没有传入正确的id')
      return false
    } 

    let res = await Leave.findByIdAndRemove(_id)
    if (res) super.success(ctx, '删除数据成功')
    else super.error(ctx, '删除数据失败')
  }

  // 修改状态
  async modifyState(ctx) {
    let { _id, state } = ctx.request.body
    if (!state) {
      ctx.throw(401, '无效参数')
      return false
    }

    let res = await Leave.update({ _id }, { state })
    if (res) super.result(ctx, {
      code: 200,
      message: '修改状态成功',
      data: res
    })
    else super.error(ctx, '更改状态失败')
  }

}

module.exports = new LeaveController()