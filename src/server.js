import Koa from 'koa'
import Http from 'http'
import config from './config'

export const start = () => {
  const app = new Koa()
  const server = Http.createServer(app.callback())

  server.listen(config.port)
}
