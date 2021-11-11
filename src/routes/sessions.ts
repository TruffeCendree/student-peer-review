import { FastifyInstance } from 'fastify'
import { SessionsCreateQuerystring } from '../schemas/types/sessions.create.querystring'
import { SessionsInviteBody } from '../schemas/types/sessions.invite.body'
import * as sessionsCreateQuerystringSchema from '../schemas/json/sessions.create.querystring.json'
import * as sessionsInviteBodySchema from '../schemas/json/sessions.invite.body.json'
import { User } from '../entities/user'
import { getConnection } from 'typeorm'
import { saveSession } from '../lib/session'
import { promisify } from 'util'
import { randomBytes } from 'crypto'
import { sendInvitation } from '../mailers/session-mailer'

export async function sessionRoutes(fastify: FastifyInstance) {
  fastify.post<{ Querystring: SessionsCreateQuerystring }>('/', {
    schema: {
      querystring: sessionsCreateQuerystringSchema
    },
    handler: async function create(request, reply) {
      // should be handled by the schema validation, but is too critical so we check it again.
      if (!request.query.token) throw new Error('Never lookup for a null loginToken, it will match the wrong user.')

      const userRepository = getConnection().getRepository(User)
      const user = await userRepository.findOneOrFail({ where: { loginToken: request.query.token } })
      user.loginToken = null
      await userRepository.save(user)

      await saveSession(reply, user)
      return { success: true }
    }
  })

  fastify.post<{ Body: SessionsInviteBody }>('/invite', {
    schema: {
      body: sessionsInviteBodySchema
    },
    handler: async function invite(request) {
      const userRepository = getConnection().getRepository(User)
      const user = await userRepository.findOneOrFail({ where: { email: request.body.email } })
      user.loginToken = (await promisify(randomBytes)(64)).toString('base64')
      await userRepository.save(user)
      await sendInvitation(user)
      return { success: true }
    }
  })
}
