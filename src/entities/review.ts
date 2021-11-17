import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId, Unique } from 'typeorm'
import { Submission } from './submission'

enum Comparison {
  WORSE = 'worse',
  SIMILAR = 'similar',
  BETTER = 'better'
}

@Entity()
@Unique('reviewedSubmissionId_reviewerSubmissionId', ['reviewedSubmission', 'reviewerSubmission'])
export class Review {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Submission, submission => submission.receivedReviews, { cascade: ['insert'], nullable: false })
  reviewedSubmission!: Promise<Submission>

  @RelationId((review: Review) => review.reviewedSubmission)
  reviewedSubmissionId!: number

  @ManyToOne(() => Submission, submission => submission.authoredReviews, { cascade: ['insert'], nullable: false })
  reviewerSubmission!: Promise<Submission>

  @RelationId((review: Review) => review.reviewerSubmission)
  reviewerSubmissionId!: number

  @Column({ type: 'text', nullable: true })
  comment!: string | null

  @Column({ type: 'enum', enum: Comparison, nullable: true })
  comparison!: 'worse' | 'similar' | 'better' | null
}
