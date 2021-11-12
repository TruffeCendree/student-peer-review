import { expect } from 'chai'
import { sign } from 'cookie-signature'
import { COOKIE_NAME, COOKIE_SECRET } from '../../lib/dotenv'
import { server } from '../../lib/fastify'
import { ProjectsIndexResponse } from '../../schemas/types/projects.index.response'
import { createProjectFixture } from '../fixtures/projects-fixtures'
import { createSessionFixture } from '../fixtures/sessions-fixtures'

describe('/projects', function () {
  describe('#index', function () {
    it('should return projects of the current user', async function () {
      const session = await createSessionFixture()
      const project1 = await createProjectFixture({ users: [session.user] })
      const project2 = await createProjectFixture({ users: [session.user] })
      const project3 = await createProjectFixture()

      const cookies = { [COOKIE_NAME]: sign(session.id, COOKIE_SECRET) }
      const response = await server.inject({ method: 'GET', url: '/projects', cookies })
      expect(response.statusCode).to.eq(200)

      const json = response.json<ProjectsIndexResponse>()
      expect(json.map(_ => _.id)).to.have.members([project1.id, project2.id])
      expect(json.map(_ => _.id)).to.not.include(project3.id)
    })
  })
})
