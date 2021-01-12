import Io from 'socket.io'

const port = 4444

const options = {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
}

export const start = () => {
  const io = Io(port, options)

  newUser(io)
}

const newUser = io => {
  io.on('connection', socket => {
    console.log(`new user: ${socket.id}`)
  })
}
