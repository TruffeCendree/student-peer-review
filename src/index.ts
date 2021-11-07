import { PORT } from './lib/dotenv'
import { fastifyInstance } from './lib/fastify'

fastifyInstance.listen(PORT).catch(console.error)
