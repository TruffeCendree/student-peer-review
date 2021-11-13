import {
  Column,
  createQueryBuilder,
  Entity,
  getRepository,
  ManyToMany,
  Not,
  OneToMany,
  PrimaryGeneratedColumn
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

  getSubmissionForUser(user: User) {
    return getRepository(Submission).findOne({ where: { project: this, user } })
  }

  private getSubmissionsWithMissingReviewsAs(role: 'reviewer' | 'reviewed') {
    const foreignKey = role === 'reviewed' ? 'reviewedSubmissionId' : 'reviewerSubmissionId'

    // COUNT(Review.id) counts 0 IF Review.id IS NULL, as opposite to COUNT(*)
    return createQueryBuilder(Submission, Submission.name)
      .leftJoin(Review, 'Review', `Review.${foreignKey} = Submission.id`)
      .where({ project: this })
      .groupBy('Submission.id')
      .having('COUNT(Review.id) < 2')
      .orderBy('COUNT(Review.id), RAND()')
  }

  /**
   * Create peer reviews couples.
   * If submissionA reviews submissionB, then submissonB also reviews submissionA.
   * The grade is computed based on the consistency of the bi-directional review.
   */
  async assignSubmissions() {
    const submissionMissingReviews = await this.getSubmissionsWithMissingReviewsAs('reviewed').getMany()

    for (const submission of submissionMissingReviews) {
      const missingReviews = 2 - (await submission.receivedReviews).length
      if (missingReviews <= 0) return // may have changed with newly created reviews

      const newReviewers = await this.getSubmissionsWithMissingReviewsAs('reviewer')
        .where({ id: Not(submission.id) }) // do not review itself
        .limit(missingReviews)
        .getMany()

      for (const newReviewer of newReviewers) {
        const review1 = new Review()
        review1.reviewedSubmission = Promise.resolve(submission)
        review1.reviewerSubmission = Promise.resolve(newReviewer)

        const review2 = new Review()
        review2.reviewedSubmission = Promise.resolve(newReviewer)
        review2.reviewerSubmission = Promise.resolve(submission)
        await getRepository(Review).save([review1, review2])
      }
    }
  }
}
