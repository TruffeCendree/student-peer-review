import { FastifyInstance } from 'fastify'
import { getConnection } from 'typeorm'
import { User } from '../entities/user'
import { UsersShowParams } from '../schemas/types/users.show.params'
import * as UsersShowParamsSchema from '../schemas/json/users.show.params.json'

export async function userRoutes(fastify: FastifyInstance) {
  fastify.route<{ Params: UsersShowParams }>({
    method: 'GET',
    url: '/:id',
    schema: {
      params: UsersShowParamsSchema
    },
    handler: async function show(request) {
      // TODO: implement sessions for the 'me' value
      return getConnection()
        .getRepository(User)
        .findOneOrFail(request.params.id === 'me' ? 1 : request.params.id)
    }
  })
}
