import fastify from 'fastify'
import cookie, { FastifyCookieOptions } from 'fastify-cookie'
import { sessionRoutes } from '../routes/sessions'
import { userRoutes } from '../routes/users'
import { COOKIE_SECRET } from './dotenv'
import { session } from './session'

export const server = fastify({ logger: true })
  .register(cookie, { secret: COOKIE_SECRET } as FastifyCookieOptions)
  .register(session)
  .register(sessionRoutes, { prefix: '/sessions' })
  .register(userRoutes, { prefix: '/users' })
