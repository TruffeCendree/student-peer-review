import { FastifyInstance } from 'fastify'
import { SessionsCreateQuerystring } from '../schemas/types/sessions.create.querystring'
import * as SessionsCreateQuerystringSchema from '../schemas/json/sessions.create.querystring.json'
import { User } from '../entities/user'
import { getConnection } from 'typeorm'
import { saveSession } from '../lib/session'

export async function sessionRoutes (fastify: FastifyInstance) {
  fastify.route<{ Querystring: SessionsCreateQuerystring }>({
    method: 'POST',
    url: '/',
    schema: {
      querystring: SessionsCreateQuerystringSchema
    },
    handler: async function create (request, reply) {
      // should be handled by the schema validation, but is too critical so we check it again.
      if (!request.query.token) throw new Error('Never lookup for a null loginToken, it is will match the wrong user.')
      
      const userRepository = getConnection().getRepository(User)
      const user = await userRepository.findOneOrFail({ where: { loginToken: request.query.token } }) 
      user.loginToken = null
      await userRepository.save(user)

      await saveSession(reply, user)
      reply.redirect('/')
    }
  })
}
