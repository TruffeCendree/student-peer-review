import fastify from 'fastify'
import { userRoutes } from '../routes/users'

export const server = fastify({ logger: true })
server.register(userRoutes, { prefix: '/users' })
