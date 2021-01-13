import compose from 'koa-compose'

const responseTime = async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
}

const logger = async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}`)
}

const requestValidation = async (ctx, next) => {
  if (ctx.is('application/json')) {
    await next()
  } else {
    ctx.throw(415, "'Content-Type: application/json' required")
  }
}

const util = compose([responseTime, logger, requestValidation])
util._name = 'util'

export default util
