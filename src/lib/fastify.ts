import fastify from 'fastify'
import cookie, { FastifyCookieOptions } from 'fastify-cookie'
import fastifyMultipart from 'fastify-multipart'
import fastifySwagger from 'fastify-swagger'
import fastifyStatic from 'fastify-static'
import { UnauthorizedError } from '../policies/policy'
import { projectsRoutes } from '../routes/projects'
import { sessionRoutes } from '../routes/sessions'
import { submissionsRoutes } from '../routes/submissions'
import { userRoutes } from '../routes/users'
import { COOKIE_SECRET, FASTIFY_LOGGING } from './dotenv'
import { multipartConfig } from './multipart'
import { loadSession } from './session'
import { swaggerConfig } from './swagger'
import * as multipartFieldNumberSchema from '../schemas/json/multipart.field.number.json'
import * as multipartFileSchema from '../schemas/json/multipart.file.json'
import * as path from 'path'
import { reviewsRoutes } from '../routes/reviews'

export const server = fastify({ logger: FASTIFY_LOGGING })
  .addSchema(multipartFieldNumberSchema)
  .addSchema(multipartFileSchema)
  .register(cookie, { secret: COOKIE_SECRET } as FastifyCookieOptions)
  .decorateRequest('session', null)
  .addHook('preHandler', loadSession)
  .register(fastifyMultipart, multipartConfig)
  .register(fastifySwagger, swaggerConfig)
  .register(sessionRoutes, { prefix: '/sessions' })
  .register(userRoutes, { prefix: '/users' })
  .register(projectsRoutes, { prefix: '/projects' })
  .register(submissionsRoutes, { prefix: '/submissions' })
  .register(reviewsRoutes, { prefix: '/reviews' })
  .register(fastifyStatic, { root: path.join(__dirname, '../../react/'), list: false })
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
