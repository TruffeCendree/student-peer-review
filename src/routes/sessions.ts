import { FastifyInstance } from 'fastify'
import { SessionsCreateQuerystring } from '../schemas/types/sessions.create.querystring'
import { SessionsInviteBody } from '../schemas/types/sessions.invite.body'
import * as sessionsCreateQuerystringSchema from '../schemas/json/sessions.create.querystring.json'
import * as sessionsInviteBodySchema from '../schemas/json/sessions.invite.body.json'
import { User } from '../entities/user'
import { getRepository } from 'typeorm'
import { saveSession } from '../lib/session'
import { promisify } from 'util'
import { randomBytes } from 'crypto'
import { sendInvitation } from '../mailers/session-mailer'

export async function sessionRoutes(fastify: FastifyInstance) {
  fastify.get<{ Querystring: SessionsCreateQuerystring }>('/establish', {
    schema: {
      querystring: sessionsCreateQuerystringSchema
    },
    handler: async function establish(request, reply) {
      // should be handled by the schema validation, but is too critical so we check it again.
      if (!request.query.token) throw new Error('Never lookup for a null loginToken, it will match the wrong user.')

      const user = await getRepository(User).findOneOrFail({ where: { loginToken: request.query.token } })
      user.loginToken = null
      await getRepository(User).save(user)

      await saveSession(reply, user)
      return { success: true }
    }
  })

  fastify.post<{ Body: SessionsInviteBody }>('/invite', {
    schema: {
      body: sessionsInviteBodySchema
    },
    handler: async function invite(request) {
      const user = await getRepository(User).findOneOrFail({ where: { email: request.body.email } })
      user.loginToken = (await promisify(randomBytes)(64)).toString('hex')
      await getRepository(User).save(user)
      await sendInvitation(user)
      return { success: true }
    }
  })
}
