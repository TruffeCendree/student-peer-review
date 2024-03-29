import { FastifyReply, FastifyRequest } from 'fastify'
import { Session } from '../entities/session'
import { User } from '../entities/user'
import { randomBytes } from 'crypto'
import { promisify } from 'util'
import { COOKIE_HTTP_ONLY, COOKIE_MAX_AGE, COOKIE_NAME, COOKIE_SECURE, COOKIE_SIGNED } from './dotenv'
import { dataSource } from './typeorm'

declare module 'fastify' {
  interface FastifyRequest {
    session?: Session | null
  }
}

export async function saveSession(reply: FastifyReply, user: User) {
  const id = (await promisify(randomBytes)(64)).toString('base64')
  await dataSource.getRepository(Session).save({ id, user })
  void reply.setCookie(COOKIE_NAME, id, {
    signed: COOKIE_SIGNED,
    httpOnly: COOKIE_HTTP_ONLY,
    secure: COOKIE_SECURE,
    maxAge: COOKIE_MAX_AGE,
    path: '/'
  })
}

export async function loadSession(request: FastifyRequest) {
  if (!request.cookies[COOKIE_NAME] || !request.cookies.sessionId) return

  const unsigned = request.unsignCookie(request.cookies.sessionId)
  const repo = dataSource.getRepository(Session)
  if (unsigned.value && unsigned.valid) request.session = await repo.findOneBy({ id: unsigned.value })
}
