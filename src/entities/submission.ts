import { MultipartFile } from 'fastify-multipart'
import { v4 as uuidv4 } from 'uuid'
import { mkdir, writeFile } from 'fs/promises'
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
import { UnauthorizedError } from '../policies/policy'

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  fileUrl!: string

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

  async setFile(file: MultipartFile) {
    if (!file.filename.toLocaleLowerCase().endsWith('.zip')) {
      throw new UnauthorizedError('You can only upload a ZIP file')
    }

    this.fileUrl = `public/submissions/${uuidv4()}-${file.filename}`
    await mkdir('public/submissions', { recursive: true })
    await writeFile(this.fileUrl, await file.toBuffer())
  }
}
