const authVerfied = require('../utils/auth')

module.exports = async (ctx, next) => {
  // 拦截非允许地址的请求
  const allowedOrigins = ['file://']
  const origin = ctx.request.headers.origin || ''
  if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
    ctx.set('Access-Control-Allow-Origin', origin)
  }

  ctx.set({
    'Access-Control-Allow-Headers': 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With',
    'Access-Control-Allow-Methods': 'PUT,PATCH,POST,GET,DELETE,OPTIONS',
    'Access-Control-Max-Age': '1728000',
    'Content-Type': 'application/json;charset=utf-8',
    'X-Powered-By': 'sjj_blog 1.0.0'
  })

  // 第一次的options 请求，若成功将 前端请求的网址 纳入白名单
  if (ctx.request.method === 'OPTIONS') {
    ctx.status = 200
    return false
  }

  // 如果是生产环境，需要验证用户来源渠道，防止非正常请求
	/* if (Object.is(process.env.NODE_ENV, 'production')) {
		const { origin, referer } = ctx.request.headers;
		if (origin !== 'file://') {
			const originVerified = (!origin	|| origin.includes('jkchao.cn')) && 
															(!referer || referer.includes('jkchao.cn'))
			if (!originVerified) {
				ctx.throw(403, { code: 0, message: '身份验证失败！' })
				return false;
			};
		}
	}; */

  // 排除一些post请求
  const isLike = Object.is(ctx.request.url, '/api/like') && Object.is(ctx.request.method, 'POST');
  const isPostAuth = Object.is(ctx.request.url, '/api/auth') && Object.is(ctx.request.method, 'POST');
  const isLogin = Object.is(ctx.request.url, '/api/login') && Object.is(ctx.request.method, 'POST');
  const isHero = Object.is(ctx.request.url, '/api/leave') && Object.is(ctx.request.method, 'POST');
  const isPostComment = Object.is(ctx.request.url, '/api/comment') && Object.is(ctx.request.method, 'POST');
  if (isLike || isPostAuth || isPostComment || isLogin || isHero) {
    await next();
    return false;
  };

  // 管理员验证通过
  if (!authVerfied(ctx.request) && !Object.is(ctx.request.method, 'GET')) {
    ctx.throw(401, { code: -2, message: '管理员验证不通过,没有权限' })
    return false
  }


  await next()
}