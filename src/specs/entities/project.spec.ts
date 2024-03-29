import { expect } from 'chai'
import { Project } from '../../entities/project'
import { Review } from '../../entities/review'
import { Submission } from '../../entities/submission'
import { dataSource } from '../../lib/typeorm'
import { ProjectsService } from '../../services/projects-service'
import { createProjectFixture } from '../fixtures/projects-fixtures'

describe('Project', function () {
  describe('#assignSubmissions', function () {
    it('should not assign to itself', async function () {
      const project = await createProjectFixture({ userCount: 1, withSubmission: true })
      const projectsService = new ProjectsService(dataSource.manager)
      const reviewsCount = await dataSource.getRepository(Review).count()
      await projectsService.assignSubmissions(project, 2)
      expect(await dataSource.getRepository(Review).count()).to.eq(reviewsCount)
    })

    it('should assign 2 reviews to each submission', async function () {
      let project = await createProjectFixture({ userCount: 4, withSubmission: true })
      const projectsService = new ProjectsService(dataSource.manager)
      await projectsService.assignSubmissions(project, 2)
      project = await dataSource.getRepository(Project).findOneByOrFail({ id: project.id }) // reload

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
      dataSource.getRepository(Review).create(review1)

      const review2 = new Review()
      review2.reviewerSubmission = Promise.resolve((await project.submissions)[0])
      review2.reviewedSubmission = Promise.resolve((await project.submissions)[1])
      dataSource.getRepository(Review).create(review2)

      const projectsService = new ProjectsService(dataSource.manager)
      await projectsService.assignSubmissions(project, 2)
      project = await dataSource.getRepository(Project).findOneByOrFail({ id: project.id }) // reload

      expect((await project.submissions).length).to.eq(4)
      for (const submission of await project.submissions) {
        expect((await submission.receivedReviews).length).to.eq(2)
        expect((await submission.authoredReviews).length).to.eq(2)
      }
    })

    it('should not duplicated peering', async function () {
      const project = await createProjectFixture({ userCount: 2, withSubmission: true })
      expect(await dataSource.getRepository(Submission).count()).to.eq(2)

      // impossible to fullfil, only one peering is possible with 2 submissions
      const projectsService = new ProjectsService(dataSource.manager)
      await projectsService.assignSubmissions(project, 2)

      // 1 peering * 2 reviews per peering
      expect(await dataSource.getRepository(Review).count()).to.eq(2)
    })

    it('should not mix project during assignation', async function () {
      let project1 = await createProjectFixture({ userCount: 2, withSubmission: true })
      let project2 = await createProjectFixture({ userCount: 2, withSubmission: true })

      const projectsService = new ProjectsService(dataSource.manager)
      await projectsService.assignSubmissions(project1, 2)
      await projectsService.assignSubmissions(project2, 2)

      project1 = await dataSource.getRepository(Project).findOneByOrFail({ id: project1.id }) // reload
      project2 = await dataSource.getRepository(Project).findOneByOrFail({ id: project2.id }) // reload

      expect(await dataSource.getRepository(Submission).count()).to.eq(4)
      expect(await dataSource.getRepository(Review).count()).to.eq(4)

      const countSubmissionsLinkedToOtherprojects = await dataSource
        .getRepository(Review)
        .createQueryBuilder()
        .innerJoin('Review.reviewedSubmission', 'ReviewedSubmission')
        .innerJoin('Review.reviewerSubmission', 'ReviewerSubmission')
        .where('ReviewedSubmission.projectId != ReviewerSubmission.projectId')
        .getCount()

      expect(countSubmissionsLinkedToOtherprojects).to.eq(0)
    })
  })
})
