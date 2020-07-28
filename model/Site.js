const mongoose = require('../db').mongoose

const siteSchema = new mongoose.Schema({
  // 网站标题
	title:	{ type: String, required: true },

	// 网站副标题
	sub_title:	{ type: String, required: true },

	// 关键字
	keyword: { type: String },

	// 网站描述
	descript: String,

	// 站点地址
	url: { type: String, required: true },

	// 网站官邮
	email: String,

	// 备案号
  icp: String,

  meta: {
		// 被喜欢次数
		likes: { type: Number, default: 0 }
	}
})

const Site = mongoose.model('Site', siteSchema)

module.exports = Site