import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
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

  @ManyToOne(() => Submission, submission => submission.authoredReviews)
  reviewerSubmission!: Promise<Submission>

  @Column({ type: 'text', nullable: true })
  comment!: string | null

  @Column({ type: 'enum', enum: Comparison, nullable: true })
  comparison!: Comparison | null
}
