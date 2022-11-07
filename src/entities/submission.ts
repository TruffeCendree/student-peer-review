import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId
} from 'typeorm'
import { Project } from './project'
import { User } from './user'
import { Review } from './review'

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  fileToken!: string

  @ManyToMany(() => User, user => user.submissions, { cascade: ['insert'], nullable: false })
  @JoinTable()
  users!: Promise<User[]>

  @ManyToOne(() => Project, project => project.submissions, { cascade: ['insert'], nullable: false })
  project!: Promise<Project>

  @RelationId((submission: Submission) => submission.project)
  projectId!: number

  @OneToMany(() => Review, review => review.reviewedSubmission)
  receivedReviews!: Promise<Review[]>

  @OneToMany(() => Review, review => review.reviewerSubmission)
  authoredReviews!: Promise<Review[]>

  get fileUrl() {
    return `/public/submissions/${this.fileToken}`
  }
}
