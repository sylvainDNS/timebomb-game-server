export const sendTo = (connection, message) => {
  connection.send(JSON.stringify(message))
}

export const sendToAll = (clients, message) => {
  clients.forEach(client => {
    client.send(JSON.stringify(message))
  })
}

export const parseMessage = msg => {
  try {
    return JSON.parse(msg)
  } catch (error) {
    console.error(`${new Date().toISOString()} | Invalid JSON`)
    return {}
  }
}
