import { FastifyInstance } from 'fastify'
import { getConnection } from 'typeorm'
import { User } from '../entities/user'
import { authorizeOfFail } from '../policies/policy'
import { canShowUser } from '../policies/users-policy'
import { UsersShowParams } from '../schemas/types/users.show.params'
import { UsersShowResponse } from '../schemas/types/users.show.response'
import * as usersShowParamsSchema from '../schemas/json/users.show.params.json'
import * as usersShowResponseSchema from '../schemas/json/users.show.response.json'

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: UsersShowParams }>('/:id', {
    schema: {
      params: usersShowParamsSchema,
      response: { 200: usersShowResponseSchema }
    },
    handler: async function show(request): Promise<UsersShowResponse> {
      const user =
        request.params.id === 'me'
          ? (request.session?.user as User)
          : await getConnection().getRepository(User).findOneOrFail(request.params.id)

      await authorizeOfFail(canShowUser, request.session, user)
      return user
    }
  })
}
