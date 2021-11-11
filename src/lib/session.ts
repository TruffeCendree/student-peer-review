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

export async function saveSession(reply: FastifyReply, user: User) {
  const id = (await promisify(randomBytes)(64)).toString('base64')
  await getConnection().getRepository(Session).save({ id, user })
  void reply.setCookie(COOKIE_NAME, id, { signed: COOKIE_SIGNED, httpOnly: COOKIE_HTTP_ONLY, secure: COOKIE_SECURE })
}

export async function loadSession(request: FastifyRequest) {
  if (!request.cookies[COOKIE_NAME]) return

  const unsigned = request.unsignCookie(request.cookies.sessionId)
  const repo = getConnection().getRepository(Session)
  if (unsigned.value && unsigned.valid) request.session = await repo.findOne(unsigned.value)
}
