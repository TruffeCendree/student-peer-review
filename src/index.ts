import { PORT } from './lib/dotenv'
import { server } from './lib/fastify'
import { initConnection } from './lib/typeorm'

async function run () {
  await initConnection()
  await server.listen(PORT)
}

run().catch(console.error)
