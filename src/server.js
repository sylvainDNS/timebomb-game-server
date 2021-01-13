import Koa from 'koa'
import Http from 'http'

const port = 4444

export const start = () => {
  const app = new Koa()
  const server = Http.createServer(app.callback())

  server.listen(port)
}
