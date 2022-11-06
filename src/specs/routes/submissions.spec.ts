import { expect } from 'chai'
import * as FormData from 'form-data'
import { createReadStream } from 'fs'
import { getRepository } from 'typeorm'
import { Submission } from '../../entities/submission'
import { server } from '../../lib/fastify'
import { SubmissionsIndexResponse } from '../../schemas/types/submissions.index.response'
import { createProjectFixture } from '../fixtures/projects-fixtures'
import { createReviewFixture } from '../fixtures/reviews-fixtures'
import { createSessionFixture } from '../fixtures/sessions-fixtures'
import { createSubmissionFixture } from '../fixtures/submissions-fixtures'
import { createUserFixture } from '../fixtures/users-fixtures'
import { loginAs } from '../spec-helper'

describe('/submissions', function () {
  describe('#index', function () {
    it('should return submissions created or reviewed by the user', async function () {
      const session = await createSessionFixture()
      const userSubmission = await createSubmissionFixture({ user: session.user })
      const reviewedSubmission = await createSubmissionFixture()
      const hiddenSubmission = await createSubmissionFixture()
      await createReviewFixture({ reviewedSubmission, reviewerSubmission: userSubmission })

      const response = await server.inject({ url: '/submissions', method: 'GET', cookies: loginAs(session) })
      expect(response.statusCode).to.eq(200)

      const json = response.json<SubmissionsIndexResponse>()
      expect(json.map(_ => _.id)).to.have.members([userSubmission.id, reviewedSubmission.id])
      expect(json.map(_ => _.id)).to.not.include(hiddenSubmission.id)
    })
  })

  describe('#create', function () {
    it('should upload a submission with 3 contributors', async function () {
      const session = await createSessionFixture()
      const secondUser = await createUserFixture()
      const thirdUser = await createUserFixture()
      const project = await createProjectFixture({ users: [session.user, secondUser, thirdUser] })
      const formData = new FormData()
      formData.append('projectId', project.id)
      formData.append('file', createReadStream('./src/specs/supports/archive.zip'))
      formData.append('userIds[]', secondUser.id)
      formData.append('userIds[]', thirdUser.id)

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

      const submission = await getRepository(Submission).findOneOrFail({ where: {}, order: { id: 'DESC' } })
      const submissionUserIds = (await submission.users).map(_ => _.id)
      expect(submissionUserIds.length).to.eq(3)
      expect(submissionUserIds).to.have.members([session.userId, secondUser.id, thirdUser.id])
    })

    it('should upload a submission with 2 contributors', async function () {
      const session = await createSessionFixture()
      const secondUser = await createUserFixture()
      const thirdUser = await createUserFixture()
      const project = await createProjectFixture({ users: [session.user, secondUser, thirdUser] })
      const formData = new FormData()
      formData.append('projectId', project.id)
      formData.append('file', createReadStream('./src/specs/supports/archive.zip'))
      formData.append('userIds[]', secondUser.id)

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

      const submission = await getRepository(Submission).findOneOrFail({ where: {}, order: { id: 'DESC' } })
      const submissionUserIds = (await submission.users).map(_ => _.id)
      expect(submissionUserIds.length).to.eq(2)
      expect(submissionUserIds).to.have.members([session.userId, secondUser.id])
    })
  })
})
