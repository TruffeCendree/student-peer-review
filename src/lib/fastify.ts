import fastify from 'fastify'
import cookie, { FastifyCookieOptions } from 'fastify-cookie'
import { sessionRoutes } from '../routes/sessions'
import { userRoutes } from '../routes/users'
import { COOKIE_SECRET, FASTIFY_LOGGING } from './dotenv'
import { loadSession } from './session'

export const server = fastify({ logger: FASTIFY_LOGGING })
  .register(cookie, { secret: COOKIE_SECRET } as FastifyCookieOptions)
  .decorateRequest('session', null)
  .addHook('preHandler', loadSession)
  .register(sessionRoutes, { prefix: '/sessions' })
  .register(userRoutes, { prefix: '/users' })
