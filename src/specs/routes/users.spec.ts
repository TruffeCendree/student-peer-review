import { server } from '../../lib/fastify'
import { createSessionFixture } from '../fixtures/sessions-fixtures'
import { expect } from 'chai'
import { createUserFixture } from '../fixtures/users-fixtures'
import { loginAs } from '../spec-helper'

describe('/users', function () {
  describe('#show', function () {
    it('should return current user identity', async function () {
      const session = await createSessionFixture()
      const response = await server.inject({ method: 'GET', url: '/users/me', cookies: loginAs(session) })
      expect(response.statusCode).to.eq(200)
      expect(response.json()).to.haveOwnProperty('id').equal(session.userId)
      expect(response.json()).to.not.haveOwnProperty('loginToken')
    })

    it('should reject if current user is not authorized', async function () {
      const session = await createSessionFixture()
      const anotherUser = await createUserFixture()
      const response = await server.inject({
        method: 'GET',
        url: `/users/${anotherUser.id}`,
        cookies: loginAs(session)
      })
      expect(response.statusCode).to.eq(403)
      expect(response.json()).to.haveOwnProperty('message').equal('You are not allowed to perform this action')
    })
  })
})
