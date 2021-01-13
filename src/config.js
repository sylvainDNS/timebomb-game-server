import env from 'common-env'

const config = env().getOrElseAll({
  host: 'localhost',
  port: 4444,
  cors: { origin: 'http://localhost:3000' },
})

export default config
