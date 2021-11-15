import { expect } from 'chai'
import { getRepository } from 'typeorm'
import { Project } from '../../entities/project'
import { Review } from '../../entities/review'
import { createProjectFixture } from '../fixtures/projects-fixtures'

describe('Project', function () {
  describe('#assignSubmissions', function () {
    it('should not assign to itself', async function () {
      const project = await createProjectFixture({ userCount: 1, withSubmission: true })
      const reviewsCount = await getRepository(Review).count()
      await project.assignSubmissions(2)
      expect(await getRepository(Review).count()).to.eq(reviewsCount)
    })

    it('should assign 2 reviews to each submission', async function () {
      let project = await createProjectFixture({ userCount: 4, withSubmission: true })
      await project.assignSubmissions(2)
      project = await getRepository(Project).findOneOrFail(project.id) // reload

      expect((await project.submissions).length).to.eq(4)
      for (const submission of await project.submissions) {
        expect((await submission.receivedReviews).length).to.eq(2)
        expect((await submission.authoredReviews).length).to.eq(2)
      }
    })

    it('should assign a single review if only one is missing', async function () {
      let project = await createProjectFixture({ userCount: 4, withSubmission: true })

      const review1 = new Review()
      review1.reviewedSubmission = Promise.resolve((await project.submissions)[0])
      review1.reviewerSubmission = Promise.resolve((await project.submissions)[1])
      getRepository(Review).create(review1)

      const review2 = new Review()
      review2.reviewerSubmission = Promise.resolve((await project.submissions)[0])
      review2.reviewedSubmission = Promise.resolve((await project.submissions)[1])
      getRepository(Review).create(review2)

      await project.assignSubmissions(2)
      project = await getRepository(Project).findOneOrFail(project.id) // reload

      expect((await project.submissions).length).to.eq(4)
      for (const submission of await project.submissions) {
        expect((await submission.receivedReviews).length).to.eq(2)
        expect((await submission.authoredReviews).length).to.eq(2)
      }
    })
  })
})
