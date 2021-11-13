import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm'
import { Submission } from './submission'

enum Comparison {
  WORSE = 'worse',
  SIMILAR = 'similar',
  BETTER = 'better'
}

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Submission, submission => submission.receivedReviews)
  reviewedSubmission!: Promise<Submission>

  @RelationId((review: Review) => review.reviewedSubmission)
  reviewedSubmissionId!: number

  @ManyToOne(() => Submission, submission => submission.authoredReviews)
  reviewerSubmission!: Promise<Submission>

  @RelationId((review: Review) => review.reviewerSubmission)
  reviewerSubmissionId!: number

  @Column({ type: 'text', nullable: true })
  comment!: string | null

  @Column({ type: 'enum', enum: Comparison, nullable: true })
  comparison!: Comparison | null
}
