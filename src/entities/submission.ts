import { MultipartFile } from '@fastify/multipart'
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

  async getUsers$() {
    const { dataSource } = await import('../lib/typeorm')

    return dataSource
      .createQueryBuilder(User, User.name)
      .innerJoin('User.submissions', Submission.name)
      .where('Submission.id = :submissionId')
      .setParameter('submissionId', this.id)
  }

  async getUserIds() {
    return (await this.getUsers$())
      .select('User.id')
      .getMany()
      .then(partialUsers => partialUsers.map(_ => _.id))
  }

  async setFile(file: MultipartFile) {
    const lowerName = file.filename.toLocaleLowerCase()
    if (!lowerName.endsWith('.zip') && !lowerName.endsWith('.pdf')) {
      throw new UnauthorizedError('You can only upload a ZIP/PDF file')
    }

    this.fileToken = `${uuidv4()}-${file.filename}`
    await mkdir('public/submissions', { recursive: true })
    await writeFile('public/submissions/' + this.fileToken, await file.toBuffer())
  }
}
