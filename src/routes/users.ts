import { FastifyInstance } from 'fastify'
import { getConnection } from 'typeorm'
import { User } from '../entities/user'
import { UsersShowParams } from '../schemas/types/users.show.params'
import * as UsersShowParamsSchema from '../schemas/json/users.show.params.json'
import { authorizeOfFail } from '../policies/policy'
import { canShowUser } from '../policies/users-policy'

export async function userRoutes(fastify: FastifyInstance) {
  fastify.route<{ Params: UsersShowParams }>({
    method: 'GET',
    url: '/:id',
    schema: {
      params: UsersShowParamsSchema
    },
    handler: async function show(request) {
      const user =
        request.params.id === 'me'
          ? request.session?.user as User
          : await getConnection().getRepository(User).findOneOrFail(request.params.id)

      await authorizeOfFail(canShowUser, request.session, user)
      return user
    }
  })
}
