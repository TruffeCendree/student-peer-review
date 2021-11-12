import { expect } from 'chai'
import { server } from '../../lib/fastify'
import { ProjectsIndexResponse } from '../../schemas/types/projects.index.response'
import { createProjectFixture } from '../fixtures/projects-fixtures'
import { createSessionFixture } from '../fixtures/sessions-fixtures'
import { loginAs } from '../spec-helper'

describe('/projects', function () {
  describe('#index', function () {
    it('should return projects of the current user', async function () {
      const session = await createSessionFixture()
      const project1 = await createProjectFixture({ users: [session.user] })
      const project2 = await createProjectFixture({ users: [session.user] })
      const project3 = await createProjectFixture()

      const response = await server.inject({ method: 'GET', url: '/projects', cookies: loginAs(session) })
      expect(response.statusCode).to.eq(200)

      const json = response.json<ProjectsIndexResponse>()
      expect(json.map(_ => _.id)).to.have.members([project1.id, project2.id])
      expect(json.map(_ => _.id)).to.not.include(project3.id)
    })
  })
})
