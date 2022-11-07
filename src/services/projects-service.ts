import { EntityManager, In, Not } from "typeorm"
import { Project } from "../entities/project"
import { Review } from "../entities/review"
import { Submission } from "../entities/submission"
import { User } from "../entities/user"

export class ProjectsService {
  constructor (private manager: EntityManager) {}

  getSubmissionForUser(project: Project, user: User) {
    return this.manager
      .getRepository(Submission)
      .createQueryBuilder()
      .innerJoin('Submission.users', 'Users')
      .andWhere({ project })
      .andWhere('Users.id = :userId')
      .setParameter('userId', user.id)
      .getOne()
  }

  private getSubmissionsWithMissingReviewsAs(project: Project, role: 'reviewer' | 'reviewed', expectedReviewsCount: number) {
    const foreignKey = role === 'reviewed' ? 'reviewedSubmissionId' : 'reviewerSubmissionId'

    // COUNT(Review.id) counts 0 IF Review.id IS NULL, as opposite to COUNT(*)
    return this.manager
      .createQueryBuilder(Submission, Submission.name)
      .leftJoin(Review, 'Review', `Review.${foreignKey} = Submission.id`)
      .andWhere({ project })
      .groupBy('Submission.id')
      .having('COUNT(Review.id) < :expectedReviewsCount')
      .setParameter('expectedReviewsCount', expectedReviewsCount)
      .orderBy('COUNT(Review.id), RAND()')
  }

  /**
   * Create peer reviews couples.
   * If submissionA reviews submissionB, then submissonB also reviews submissionA.
   * The grade is computed based on the consistency of the bi-directional review.
   */
  async assignSubmissions(project: Project, expectedReviewsCount: number) {
    const submissionMissingReviews = await this.getSubmissionsWithMissingReviewsAs(project, 'reviewed', expectedReviewsCount).getMany()

    for (const submission of submissionMissingReviews) {
      const missingReviews = expectedReviewsCount - (await submission.receivedReviews).length
      if (missingReviews <= 0) return // may have changed with newly created reviews

      // it should ignore the submissions that are already assigned as reviewer
      const alreadyPeeredWithSubmissionIds = (await submission.receivedReviews).map(_ => _.reviewerSubmissionId)

      const newReviewers = await this.getSubmissionsWithMissingReviewsAs(project, 'reviewer', expectedReviewsCount)
        .andWhere({ id: Not(submission.id) }) // do not review itself
        .andWhere({ id: Not(In(alreadyPeeredWithSubmissionIds)) })
        .limit(missingReviews)
        .getMany()

      const newReviews = []

      for (const newReviewer of newReviewers) {
        const review1 = new Review()
        review1.reviewedSubmission = Promise.resolve(submission)
        review1.reviewerSubmission = Promise.resolve(newReviewer)

        const review2 = new Review()
        review2.reviewedSubmission = Promise.resolve(newReviewer)
        review2.reviewerSubmission = Promise.resolve(submission)
        newReviews.push(review1, review2)
      }

      await this.manager.getRepository(Review).save(newReviews)
    }
  }
}
