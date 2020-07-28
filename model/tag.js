const mongoose = require('../db/index').mongoose
const autoIncrement = require('mongoose-auto-increment')
const mongoosePaginate = require('mongoose-paginate')

autoIncrement.initialize(mongoose.connection)

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, validate: /\S+/ },
  descript: String,
  create_time: { type: Date, default: Date.now },
  update_time: {type: Date},
  sort: { type: Number, default: 0 }
})

tagSchema.plugin(mongoosePaginate)
tagSchema.plugin(autoIncrement.plugin, {
	model: 'Tag',
	field: 'id',
	startAt: 1,
	incrementBy: 1
})

tagSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_time: Date.now() })
  next()
})

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag