import { expect } from 'chai'
import FormData = require('form-data')
import { createReadStream } from 'fs'
import { server } from '../../lib/fastify'
import { createProjectFixture } from '../fixtures/projects-fixtures'
import { createSessionFixture } from '../fixtures/sessions-fixtures'
import { loginAs } from '../spec-helper'

describe('/submissions', function () {
  describe('#create', function () {
    it('should upload a submission', async function () {
      const session = await createSessionFixture()
      const project = await createProjectFixture({ users: [session.user] })
      const formData = new FormData()
      formData.append('projectId', project.id)
      formData.append('file', createReadStream('./package.json'))

      const response = await server.inject({
        url: '/submissions',
        method: 'POST',
        payload: formData,
        headers: formData.getHeaders(),
        cookies: loginAs(session)
      })

      expect(response.statusCode).to.eq(200)
      expect(response.json()).to.haveOwnProperty('id')
      expect(response.json()).to.haveOwnProperty('fileUrl')
    })
  })
})
