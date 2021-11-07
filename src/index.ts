import { PORT } from './lib/dotenv'
import { server } from './lib/fastify'
import { createConnectionFromEnv } from './lib/typeorm'

createConnectionFromEnv().then(connection => connection.close())
server.listen(PORT).catch(console.error)
