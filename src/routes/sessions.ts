import { FastifyInstance } from 'fastify'
import { SessionsCreateBody } from '../schemas/types/sessions.create.body'
import { SessionsInviteBody } from '../schemas/types/sessions.invite.body'
import * as sessionsCreateBodySchema from '../schemas/json/sessions.create.body.json'
import * as sessionsInviteBodySchema from '../schemas/json/sessions.invite.body.json'
import { User } from '../entities/user'
import { saveSession } from '../lib/session'
import { promisify } from 'util'
import { randomBytes } from 'crypto'
import { sendInvitation } from '../mailers/session-mailer'
import { dataSource } from '../lib/typeorm'

export async function sessionRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: SessionsCreateBody }>('', {
    schema: {
      body: sessionsCreateBodySchema
    },
    handler: async function establish(request, reply) {
      // should be handled by the schema validation, but is too critical so we check it again.
      if (!request.body.token) throw new Error('Please provide the token received per email, it is required to sign in.')

      const user = await dataSource.getRepository(User).findOneOrFail({ where: { loginToken: request.body.token } })
      user.loginToken = null
      await dataSource.getRepository(User).save(user)

      await saveSession(reply, user)
      return { success: true }
    }
  })

  fastify.post<{ Body: SessionsInviteBody }>('/invite', {
    schema: {
      body: sessionsInviteBodySchema
    },
    handler: async function invite(request) {
      const user = await dataSource.getRepository(User).findOneOrFail({ where: { email: request.body.email } })
      user.loginToken = (await promisify(randomBytes)(64)).toString('hex')
      await dataSource.getRepository(User).save(user)
      await sendInvitation(user)
      return { success: true }
    }
  })
}
