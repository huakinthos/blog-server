// 文章
const mongoose = require('../db').mongoose
const autoIncrement = require('mongoose-auto-increment')
const mongoosePaginate = require('mongoose-paginate')

autoIncrement.initialize(mongoose.connection)

const articleSchema = new mongoose.Schema({
  // 文章标题
  title: { type: String, required: true },

  // 关键字
  keyword: { type: String, required: true },

  // 描述
  descript: { type: String, required: false },

  // 标签
  tag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],

  // 内容
  content: { type: String, required: true },

  // 状态 1 发布 2 草稿
  state: { type: Number, default: 1 },

  // 文章公开状态 1 公开 2 私密
  publish: { type: Number, default: 1 },

	// 缩略图
  thumb: String,

  // 文章分类 1 code 2 生活
  type: { type: Number },

  create_time: { type: Date, default: Date.now },

  update_time: { type: Date, default: Date.now },

  // 其他信息
  meta: {
    views: { type: Number, default: 0 },
		likes: { type: Number, default: 0 },
		comments: { type: Number, default: 0 }
  }

})

articleSchema.set('toObject', { getters: true })

articleSchema.plugin(mongoosePaginate)
articleSchema.plugin(autoIncrement.plugin, {
	model: 'Article',
	field: 'id',
	startAt: 1,
	incrementBy: 1
})

// 时间更新
articleSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_time: Date.now() })
  next()
})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article