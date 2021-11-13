import { MultipartFile } from 'fastify-multipart'
import { v4 as uuidv4 } from 'uuid'
import { mkdir, writeFile } from 'fs/promises'
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm'
import { Project } from './project'
import { User } from './user'
import { Review } from './review'

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  fileUrl!: string

  @ManyToOne(() => User, user => user.submissions, { cascade: ['insert'], nullable: false })
  user!: Promise<User>

  @RelationId((submission: Submission) => submission.user)
  userId!: number

  @ManyToOne(() => Project, project => project.submissions, { cascade: ['insert'], nullable: false })
  project!: Promise<Project>

  @RelationId((submission: Submission) => submission.project)
  projectId!: number

  @OneToMany(() => Review, review => review.reviewedSubmission)
  receivedReviews!: Promise<Review[]>

  @OneToMany(() => Review, review => review.reviewerSubmission)
  authoredReviews!: Promise<Review[]>

  async setFile(file: MultipartFile) {
    this.fileUrl = `public/submissions/${uuidv4()}-${file.filename}`
    await mkdir('public/submissions', { recursive: true })
    await writeFile(this.fileUrl, await file.toBuffer())
  }
}
