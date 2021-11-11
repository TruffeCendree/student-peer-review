import { server } from '../../lib/fastify'
import { createSessionFixture } from '../fixtures/sessions-fixtures'
import { sign } from 'cookie-signature'
import { COOKIE_NAME, COOKIE_SECRET } from '../../lib/dotenv'
import { expect } from 'chai'

describe('/users', function () {
  describe('#show', function () {
    it('should return current user identity', async function () {
      const session = await createSessionFixture()
      const cookies = { [COOKIE_NAME]: sign(session.id, COOKIE_SECRET) }
      const response = await server.inject({ method: 'GET', url: '/users/me', cookies })
      expect(response.statusCode).to.eq(200)
      expect(response.json()).to.haveOwnProperty('id').equal(session.user.id)
    })
  })
})
