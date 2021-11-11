import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { getConnection } from 'typeorm'
import { Session } from '../entities/session'
import { User } from '../entities/user'
import { randomBytes } from 'crypto'
import { promisify } from 'util'
import { COOKIE_HTTP_ONLY, COOKIE_NAME, COOKIE_SECURE, COOKIE_SIGNED } from './dotenv'

declare module 'fastify' {
  interface FastifyRequest {
    session?: Session
  }
}

export async function session(fastify: FastifyInstance) {
  fastify.decorateRequest('session', null)
  fastify.addHook('preHandler', loadSession)
}

export async function saveSession(reply: FastifyReply, user: User) {
  const id = (await promisify(randomBytes)(64)).toString('base64')
  await getConnection().getRepository(Session).save({ id, user })
  void reply.setCookie(COOKIE_NAME, id, { signed: COOKIE_SIGNED, httpOnly: COOKIE_HTTP_ONLY, secure: COOKIE_SECURE })
}

async function loadSession(request: FastifyRequest) {
  if (!request.cookies[COOKIE_NAME]) return
  request.session = await getConnection().getRepository(Session).findOne(request.cookies.sessionId)
}
