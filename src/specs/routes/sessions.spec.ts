import { server } from '../../lib/fastify'
import { createUserFixture } from '../fixtures/users-fixtures'
import { expect } from 'chai'
import { getRepository } from 'typeorm'
import { User } from '../../entities/user'
import { SessionsInviteBody } from '../../schemas/types/sessions.invite.body'

describe('/sessions', function () {
  describe('#create', function () {
    it('should create a session', async function () {
      let user = await createUserFixture({ loginToken: 'some-secret-token' })
      const response = await server.inject({ method: 'GET', url: `/sessions/establish?token=${user.loginToken!}` })
      expect(response.statusCode).to.eq(200)
      expect(response.json()).to.haveOwnProperty('success').equals(true)
      expect(response.headers).to.haveOwnProperty('set-cookie')
      expect((await user.sessions).length).to.eq(1)

      // reload the user entity
      user = await getRepository(User).findOneByOrFail({ id: user.id })
      expect(user.loginToken).to.be.null
    })
  })

  describe('#invite', function () {
    it('should send an invitation link for known emails', async function () {
      const user = await createUserFixture({ loginToken: 'some-secret-token' })
      const body: SessionsInviteBody = { email: user.email }
      const response = await server.inject({ method: 'POST', url: `/sessions/invite`, payload: body })
      expect(response.statusCode).to.eq(200)
      expect(response.json()).to.haveOwnProperty('success').equals(true)
    })
  })
})
