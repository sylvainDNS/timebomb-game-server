import * as server from './server'

process.on('unhandledRejection', err => {
  console.error(err)
  process.exit(1)
})

server.start()
