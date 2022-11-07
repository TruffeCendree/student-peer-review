import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
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
}
