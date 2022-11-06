import {
  Column,
  Entity,
  In,
  ManyToMany,
  Not,
  OneToMany,
  PrimaryGeneratedColumn,
  SelectQueryBuilder
} from 'typeorm'
import { Review } from './review'
import { Submission } from './submission'
import { User } from './user'

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column({ type: 'text', nullable: true })
  instructions!: string | null

  @ManyToMany(() => User, user => user.projects, { cascade: ['insert'] })
  users!: Promise<User[]>

  @OneToMany(() => Submission, submission => submission.project, { cascade: ['insert'] })
  submissions!: Promise<Submission[]>

  async getSubmissionForUser(user: User) {
    const { dataSource } = await import('../lib/typeorm')

    return dataSource
      .getRepository(Submission)
      .createQueryBuilder()
      .innerJoin('Submission.users', 'Users')
      .andWhere({ project: this })
      .andWhere('Users.id = :userId')
      .setParameter('userId', user.id)
      .getOne()
  }

  private async getSubmissionsWithMissingReviewsAs(role: 'reviewer' | 'reviewed', expectedReviewsCount: number) {
    const { dataSource } = await import('../lib/typeorm')
    const foreignKey = role === 'reviewed' ? 'reviewedSubmissionId' : 'reviewerSubmissionId'

    // COUNT(Review.id) counts 0 IF Review.id IS NULL, as opposite to COUNT(*)
    return dataSource
      .createQueryBuilder(Submission, Submission.name)
      .leftJoin(Review, 'Review', `Review.${foreignKey} = Submission.id`)
      .andWhere({ project: this })
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
  async assignSubmissions(expectedReviewsCount: number) {
    const { dataSource } = await import('../lib/typeorm')
    const submissionMissingReviews = await (await this.getSubmissionsWithMissingReviewsAs('reviewed', expectedReviewsCount)).getMany()

    for (const submission of submissionMissingReviews) {
      const missingReviews = expectedReviewsCount - (await submission.receivedReviews).length
      if (missingReviews <= 0) return // may have changed with newly created reviews

      // it should ignore the submissions that are already assigned as reviewer
      const alreadyPeeredWithSubmissionIds = (await submission.receivedReviews).map(_ => _.reviewerSubmissionId)

      const newReviewers = await (await this.getSubmissionsWithMissingReviewsAs('reviewer', expectedReviewsCount))
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

      await dataSource.getRepository(Review).save(newReviews)
    }
  }
}
