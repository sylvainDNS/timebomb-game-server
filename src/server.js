import Koa from 'koa'
import Http from 'http'
import Io from 'socket.io'
import util from './handler/util'

const port = 4444

const options = {
  cors: {
    origin: 'http://localhost:3000',
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

  server.listen(port)
}

const newUser = io => {
  io.on('connection', socket => {
    console.log(`new user: ${socket.id}`)
  })
}
