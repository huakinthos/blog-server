class App {
  result (ctx, result) {
    if (result.status) {
      ctx.status = result.status
    }
    ctx.body = result
  }
  success (ctx, successText) {
    ctx.body = {
      code: 200,
      message: successText
    }
  }
  error (ctx, errorText) {
    ctx.body = {
      code: 404,
      message: errorText
    }
  }
}

module.exports = App