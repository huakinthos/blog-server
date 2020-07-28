const NeteaseMusic = require('simple-netease-cloud-music')
const nm = new NeteaseMusic()
const App = require('./app')

class MusicController extends App {
  async getSearch(ctx) {
    let { keyword = '', page = 1, limit = 3 } = ctx.query
    console.log(ctx.query)
    if (!keyword) return super.error(ctx, '亲输入关键词')
    let res = await nm.search(keyword, page, limit)
    super.result(ctx, {
      code: 200,
      message: '搜索成功',
      data: res
    })
  }

  async getList(ctx) {
    const play_list_id = ctx.params.play_list_id
    if (!play_list_id) return super.error(ctx, '歌单列表参数错误')
    let { playlist } = await nm.playlist(play_list_id)
    super.result(ctx, {
      code: 200,
      message: '获取歌单列表成功',
      data: playlist
    })
  }

  async getAlbum(ctx) {
    const id = ctx.params.id
    if (!id) return super.error(ctx, '获取专辑歌单参数错误')
    const res = await nm.album(id)
    super.result(ctx, {
      code: 200,
      message: '获取专辑歌单成功',
      data: res
    })
  }

  async getSong(ctx) {
    const song_id = ctx.params.song_id
    if (!song_id) return super.error(ctx, '获取歌曲参数错误')
    const res = await nm.song(song_id)
    super.result(ctx, {
      code: 200,
      message: '获取歌曲成功',
      data: res
    })
  }

  async getSongUrl(ctx) {
    const url_id = ctx.params.url_id
    if (!url_id) return super.error(ctx, '获取歌曲地址参数错误')
    const res = await nm.url(url_id)
    super.result(ctx, {
      code: 200,
      message: '获取歌曲地址成功',
      data: res
    })
  }

  async getLyric(ctx) {
    const lyric_id = ctx.params.lyric_id
    if (!lyric_id) return super.error(ctx, '获取歌词参数错误')
    const res = await nm.lyric(lyric_id)
    super.result(ctx, {
      code: 200,
      message: '获取歌词成功',
      data: res
    })
  }

  async getPicture(ctx) {
    const picture_id = ctx.params.picture_id
    if (!picture_id) return super.error(ctx, '获取图片地址参数错误')
    const res = await nm.picture(picture_id, 400)
    super.result(ctx, {
      code: 200,
      message: '获取图片地址成功',
      data: res
    })
  }

  async getArtist(ctx) {
    const artist_id = ctx.params.artist_id
    if (!artist_id) return super.error(ctx, '获取艺术家参数错误')
    const res = await nm.artist(artist_id, 50)
    super.result(ctx, {
      code: 200,
      message: '获取艺术家成功',
      data: res
    })
  }
}

module.exports = new MusicController()