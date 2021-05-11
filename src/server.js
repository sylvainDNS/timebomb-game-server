import Koa from 'koa'
import Http from 'http'
import WebSocket from 'ws'
import config from './config'
import { v4 as uuidv4 } from 'uuid'
import { parseMessage, sendTo, sendToAll } from './util'

export const start = () => {
  const app = new Koa()
  const server = Http.createServer(app.callback())

  const wss = new WebSocket.Server({ server })

  handleWebSocket(wss)

  server.listen(config.port, () => {
    console.log(
      `Signalling server running on: http://${config.host}:${config.port}/`
    )
  })
}

const TYPE = {
  CONNECTION: 'connection',
  CREATE: 'create',
  CREATED: 'created',
  JOIN: 'join',
  JOINED: 'joined',
  CLOSE: 'close',
  FAILED: 'failed',
}

const handleWebSocket = wss => {
  let rooms = {}

  wss.on(TYPE.CONNECTION, ws => {
    ws.on('message', msg => {
      const data = parseMessage(msg)
      const { type, payload } = data

      if (payload) {
        switch (type) {
          case TYPE.CREATE: {
            const { name, player } = data.payload
            const roomId = uuidv4()

            if (name && player.id && player.name) {
              rooms[roomId] = {
                name,
                players: [{ ...ws, name: player.name, id: player.id }],
              }

              sendTo(ws, { type: TYPE.CREATED, payload: name })
            } else {
              sendTo(ws, { type: TYPE.FAILED, payload: 'Missing parameter' })
            }

            break
          }
          case TYPE.JOIN: {
            const data = parseMessage(msg)
            const { roomId, player } = data.payload

            if (!rooms[roomId]) {
              sendTo(ws, { type: TYPE.FAILED, payload: 'Room does not exist' })
            } else if (!player.id || !player.name) {
              sendTo(ws, { type: TYPE.FAILED, payload: 'Missing parameter' })
            } else {
              const room = rooms[roomId]
              const players = [...room.players, { ...ws, ...player }]
              rooms[roomId] = {
                ...room,
                players,
              }

              const playerList = players.map(({ id, name }) => ({ id, name }))

              sendToAll(players, { type: TYPE.JOINED, payload: playerList })
            }

            break
          }
          default:
            sendTo(ws, { type: TYPE.FAILED, payload: 'Unhandled message type' })
            break
        }
      }
    })

    ws.on(TYPE.CLOSE, () => {
      console.log('disconnected')
    })
  })
}
