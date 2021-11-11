import { server } from '../../lib/fastify'
import { createUserFixture } from '../fixtures/users-fixtures'
import { expect } from 'chai'
import { getConnection } from 'typeorm'
import { User } from '../../entities/user'

describe('/sessions', function () {
  describe('#create', function () {
    it('should create a session', async function () {
      let user = await createUserFixture({ loginToken: 'some-secret-token' })
      const response = await server.inject({ method: 'POST', url: `/sessions?token=${user.loginToken as string}` })
      expect(response.statusCode).to.eq(302)
      expect(response.headers.location).to.eq('/')
      expect(response.headers).to.haveOwnProperty('set-cookie')
      expect((await user.sessions).length).to.eq(1)
    
      // reload the user entity
      user = await getConnection().getRepository(User).findOneOrFail(user.id)
      expect(user.loginToken).to.be.null
    })
  })
})
