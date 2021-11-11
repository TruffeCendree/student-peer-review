import fastify from 'fastify'
import cookie, { FastifyCookieOptions } from 'fastify-cookie'
import fastifySwagger from 'fastify-swagger'
import { UnauthorizedError } from '../policies/policy'
import { sessionRoutes } from '../routes/sessions'
import { userRoutes } from '../routes/users'
import { COOKIE_SECRET, FASTIFY_LOGGING } from './dotenv'
import { loadSession } from './session'
import { swaggerConfig } from './swagger'

export const server = fastify({ logger: FASTIFY_LOGGING })
  .register(cookie, { secret: COOKIE_SECRET } as FastifyCookieOptions)
  .decorateRequest('session', null)
  .addHook('preHandler', loadSession)
  .register(fastifySwagger, swaggerConfig)
  .register(sessionRoutes, { prefix: '/sessions' })
  .register(userRoutes, { prefix: '/users' })
  .setErrorHandler((error, request, reply) => {
    // based on https://github.com/fastify/fastify/blob/1e94070992d911a81a26597c25f2d35ae65f3d91/fastify.js#L74
    if (error instanceof UnauthorizedError) {
      void reply.status(422).send(error)
    } else if (reply.statusCode < 500) {
      reply.log.info({ res: reply, err: error }, error?.message)
      void reply.send(error)
    } else {
      reply.log.error({ req: request, res: reply, err: error }, error?.message)
      void reply.send(new Error('Internal Server Error, message dropped'))
    }
  })
