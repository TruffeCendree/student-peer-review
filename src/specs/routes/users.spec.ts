import { server } from '../../lib/fastify'
import { createSessionFixture } from '../fixtures/sessions-fixtures'
import { sign } from 'cookie-signature'
import { COOKIE_NAME, COOKIE_SECRET } from '../../lib/dotenv'
import { expect } from 'chai'
import { createUserFixture } from '../fixtures/users-fixtures'

describe('/users', function () {
  describe('#show', function () {
    it('should return current user identity', async function () {
      const session = await createSessionFixture()
      const cookies = { [COOKIE_NAME]: sign(session.id, COOKIE_SECRET) }
      const response = await server.inject({ method: 'GET', url: '/users/me', cookies })
      expect(response.statusCode).to.eq(200)
      expect(response.json()).to.haveOwnProperty('id').equal(session.user.id)
    })

    it('should reject if current user is not authorized', async function () {
      const session = await createSessionFixture()
      const anotherUser = await createUserFixture()
      const cookies = { [COOKIE_NAME]: sign(session.id, COOKIE_SECRET) }
      const response = await server.inject({ method: 'GET', url: `/users/${anotherUser.id}`, cookies })
      expect(response.statusCode).to.eq(422)
      expect(response.json()).to.haveOwnProperty('message').equal('You are not allowed to perform this action')
    })
  })
})
