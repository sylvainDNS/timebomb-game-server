import Koa from 'koa'
import Http from 'http'
import config from './config'
import WebSocket from 'ws'
import { v4 as uuidv4 } from 'uuid'

export const start = () => {
  const app = new Koa()
  const server = Http.createServer(app.callback())

  let users = {}

  const sendTo = (connection, message) => {
    connection.send(JSON.stringify(message))
  }

  const sendToAll = (clients, type, { id, name: userName }) => {
    Object.values(clients).forEach(client => {
      if (client.name !== userName) {
        client.send(
          JSON.stringify({
            type,
            user: { id, userName },
          })
        )
      }
    })
  }

  const parseMessage = msg => {
    try {
      return JSON.parse(msg)
    } catch (error) {
      console.error(`${new Date().toISOString()} | Invalid JSON`)
      return {}
    }
  }

  const wss = new WebSocket.Server({ server })
  wss.on('connection', ws => {
    ws.on('close', () => {
      delete users[ws.name]
      sendToAll(users, 'leave', ws)
    })

    ws.on('message', msg => {
      const data = parseMessage(msg)
      const { type, name, offer, answer, candidate } = data

      switch (type) {
        case 'login': {
          if (users[name]) {
            sendTo(ws, {
              type: 'login',
              success: false,
              message: 'Username is unavailable',
            })
            break
          }

          const loggedIn = Object.values(users).map(
            ({ id, name: userName }) => ({
              id,
              userName,
            })
          )

          users[name] = ws
          ws.name = name
          ws.id = uuidv4()

          sendTo(ws, {
            type: 'login',
            success: true,
            users: loggedIn,
          })
          sendToAll(users, 'updateUsers', ws)
          break
        }
        case 'offer': {
          const offerRecipient = users[name]

          if (offerRecipient) {
            sendTo(offerRecipient, {
              type: 'offer',
              offer,
              name: ws.name,
            })
            break
          }

          sendTo(ws, {
            type: 'error',
            message: `User ${name} does not exist`,
          })
          break
        }
        case 'answer': {
          const answerRecipient = users[name]

          if (answerRecipient) {
            sendTo(answerRecipient, { type: 'answer', answer })
            break
          }

          sendTo(ws, {
            type: 'error',
            message: `User ${name} does not exist`,
          })
          break
        }
        case 'candidate': {
          const candidateRecipient = users[name]
          if (candidateRecipient) {
            sendTo(candidateRecipient, {
              type: 'candidate',
              candidate,
            })
            break
          }

          sendTo(ws, {
            type: 'error',
            message: `User ${name} does not exist`,
          })
          break
        }
        case 'leave':
          sendToAll(users, 'leave', ws)
          break
        default:
          sendTo(ws, {
            type: 'error',
            message: `Command not found: ${type}`,
          })
          break
      }
    })

    ws.send(
      JSON.stringify({
        type: 'connect',
        message: 'Well hello there, I am a WebSocket server',
      })
    )
  })

  server.listen(config.port, () => {
    console.log(
      `Signalling server running on port: http://${config.host}:${config.port}/`
    )
  })
}
