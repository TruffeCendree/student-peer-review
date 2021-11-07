import { fastify } from './fastify'

export * from 'fastify'
export const fastifyInstance = fastify({ logger: true })
