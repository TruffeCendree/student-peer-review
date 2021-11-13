import { Column, Entity, getRepository, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
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

  @ManyToMany(() => User, user => user.projects)
  users!: Promise<User[]>

  @OneToMany(() => Submission, submission => submission.project)
  submissions!: Promise<Submission[]>

  getSubmissionForUser(user: User) {
    return getRepository(Submission).findOne({ where: { project: this, user } })
  }
}
