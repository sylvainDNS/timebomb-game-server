import Koa from 'koa'
import Http from 'http'
import Io from 'socket.io'
import config from './config'
import util from './handler/util'

const options = {
  cors: {
    origin: config.cors.origin,
    methods: ['GET', 'POST'],
  },
  serveClient: false,
}

export const start = () => {
  const app = new Koa()
  const server = Http.createServer(app.callback())

  const io = Io(server, options)

  app.use(util)

  newUser(io)

  server.listen(config.port)
}

const newUser = io => {
  io.on('connection', socket => {
    console.log(`new user: ${socket.id}`)
  })
}
