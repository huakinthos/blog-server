const Router = require('koa-router')
const config = require('../config')
const controller = require('../controller')

const router = new Router({
  prefix: config.SERVER.path 
})

router.get('/', (ctx, next) => {
  ctx.response.body = 'welcome nodejs'
})
.post('/auth', controller.auth.login) // 登录
.get('/auth', controller.auth.getAuth) // 获取信息
.put('/auth', controller.auth.editAuth) // 修改信息

.get('/leave', controller.leave.getLeave) // 获取留言
.post('/leave', controller.leave.postLeave) // 添加留言
.delete('/leave/:id', controller.leave.deleteLeave) // 删除留言
.put('/leave/:id', controller.leave.modifyState) // 修改状态

.get('/comment', controller.comment.getCommentList) // 获取评论
.post('/comment', controller.comment.postComment) // 提交评论
.delete('/comment/:id', controller.comment.delComment) // 删除评论
.put('/comment/:id', controller.comment.editCommnet) // 修改评论

.get('/tag', controller.tag.getTag) // 获取标签
.post('/tag', controller.tag.postTag) // 添加标签
.patch('/tag', controller.tag.patchTag) // 标签排序
.post('/tag/:id', controller.tag.editTag) // 修改标签
.delete('/tag/:id', controller.tag.deleteTag) // 删除标签

.get('/article', controller.article.getArticleList) // 根据页数获取文章列表
.post('/article', controller.article.postArticle) // 发表文章
.get('/article/:id', controller.article.getArticle) // 更具id获取文章内容
.delete('/article/:id', controller.article.deleteArticle) // 删除文章
.put('/article/:id', controller.article.editArticle) // 修改内容
.patch('/article/:id', controller.article.patchArticle) // 修改文章状态
.get('/archive', controller.article.getArchive) // 获取所有文章

.post('/like', controller.like.postLike) // 增加点赞数

.get('/site', controller.site.getSite) // 获取网站信息
.put('/site', controller.site.editSite) // 修改网站信息

.get('/music', controller.music.getSearch)
.get('/music/list/:play_list_id', controller.music.getList)
.get('/music/song/:song_id', controller.music.getSong)
.get('/music/url/:url_id', controller.music.getSongUrl)
.get('/music/lyric/:lyric_id', controller.music.getLyric)
.get('/music/pic/:picture_id', controller.music.getPicture)
.get('/music/art/:artist_id', controller.music.getArtist)
.get('/music/album/:id', controller.music.getAlbum)

module.exports = router