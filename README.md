## mongoose-pagination 插件
```javascript
var mongoose = require('mongoose');

var mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({ /* schema definition */ });

schema.plugin(mongoosePaginate);

var Model = mongoose.model('Model', schema); // Model.paginate()


// Model.paginate([query], [options], [callback])
Model.paginate({}, { page: 1, limit: 10 }, function(error, res) {
  res.docs // 当页的返回
  res.limit // 当页的数量 10
  res.page // 当前页数 1
  res.pages // 总页数
  res.total // 总量
})


/* 2. 全局默认设置 在mian中*/
var mongoosePaginate = require('mongoose-paginate')
mongoosePaginate.paginate.options = {
  lean: true,
  limit: 20

}
Model.paginate({}, {}).then(res => {
  res.limiy // 20
  res.docs // plain object
}).catch(error => {})
```