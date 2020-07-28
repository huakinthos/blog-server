// 评论model
const mongoose = require('../db').mongoose
const autoIncrement = require('mongoose-auto-increment')
const mongoosePaginate = require('mongoose-paginate')

autoIncrement.initialize(mongoose.connection)

const commentSchema = new mongoose.Schema({
  // 文章_id
  refer_id: { type: Number, required: true },
  // 父级评论
  pid: { type: Number, default: 0 },
  content: { type: String, required: true, validate: /\S+/ },
  likes: { type: Number, default: 0 },

  // 评论者
  author: {
    name: { type: String, required: true, validate: /\S+/ },
    email: { type: String, required: true, validate: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/ },
		url: { type: String, validate: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ }
  },
  create_time: { type: Date, default: Date.now }
})

commentSchema.plugin(mongoosePaginate)
commentSchema.plugin(autoIncrement.plugin, {
  model: 'Comment',
  field: 'id',
	startAt: 1,
	incrementBy: 1
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment