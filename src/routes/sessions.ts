import { FastifyInstance } from 'fastify'
import { SessionsCreateQuerystring } from '../schemas/types/sessions.create.querystring'
import * as sessionsCreateQuerystringSchema from '../schemas/json/sessions.create.querystring.json'
import { User } from '../entities/user'
import { getConnection } from 'typeorm'
import { saveSession } from '../lib/session'

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
      void reply.redirect('/')
    }
  })
}
