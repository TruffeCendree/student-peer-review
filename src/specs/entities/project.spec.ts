import { expect } from 'chai'
import { getRepository } from 'typeorm'
import { Project } from '../../entities/project'
import { Review } from '../../entities/review'
import { Submission } from '../../entities/submission'
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
      project = await getRepository(Project).findOneByOrFail({ id: project.id }) // reload

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
      project = await getRepository(Project).findOneByOrFail({ id: project.id }) // reload

      expect((await project.submissions).length).to.eq(4)
      for (const submission of await project.submissions) {
        expect((await submission.receivedReviews).length).to.eq(2)
        expect((await submission.authoredReviews).length).to.eq(2)
      }
    })

    it('should not duplicated peering', async function () {
      const project = await createProjectFixture({ userCount: 2, withSubmission: true })
      expect(await getRepository(Submission).count()).to.eq(2)

      // impossible to fullfil, only one peering is possible with 2 submissions
      await project.assignSubmissions(2)

      // 1 peering * 2 reviews per peering
      expect(await getRepository(Review).count()).to.eq(2)
    })

    it('should not mix project during assignation', async function () {
      let project1 = await createProjectFixture({ userCount: 2, withSubmission: true })
      let project2 = await createProjectFixture({ userCount: 2, withSubmission: true })

      await project1.assignSubmissions(2)
      await project2.assignSubmissions(2)

      project1 = await getRepository(Project).findOneByOrFail({ id: project1.id }) // reload
      project2 = await getRepository(Project).findOneByOrFail({ id: project2.id }) // reload

      expect(await getRepository(Submission).count()).to.eq(4)
      expect(await getRepository(Review).count()).to.eq(4)

      const countSubmissionsLinkedToOtherprojects = await (await getRepository(Review))
        .createQueryBuilder()
        .innerJoin('Review.reviewedSubmission', 'ReviewedSubmission')
        .innerJoin('Review.reviewerSubmission', 'ReviewerSubmission')
        .where('ReviewedSubmission.projectId != ReviewerSubmission.projectId')
        .getCount()

      expect(countSubmissionsLinkedToOtherprojects).to.eq(0)
    })
  })
})
