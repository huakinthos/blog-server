// 留言表
const mongoose = require('../db').mongoose
const autoIncrement = require('mongoose-auto-increment')
const mongoosePaginate = require('mongoose-paginate')

autoIncrement.initialize(mongoose.connection)

const leaveSchema = new mongoose.Schema({
  name: String,
  content: { type: String, required: true, validate: /\S+/ },
  // 生贺状态 0待审核， 1通过， 2未通过
  state: { type: Number, default: 0},
  create_time: { type: Date, default: Date.now },
  // ip
  ip: { type: String },
  // ip 物理地址
	city: { type: String },
	range: { type: String },
	country: { type: String },
})

leaveSchema.plugin(mongoosePaginate)
leaveSchema.plugin(autoIncrement.plugin, {
  model: 'Leave',
  field: 'id',
	startAt: 1,
	incrementBy: 1
})

const Leave = mongoose.model('Leave', leaveSchema)
module.exports = Leave