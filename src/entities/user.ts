import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Project } from './project'
import { Session } from './session'
import { Submission } from './submission'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  firstname!: string

  @Column()
  lastname!: string

  @Column({ unique: true })
  email!: string

  @Column({ type: 'varchar', unique: true, nullable: true })
  loginToken!: string | null

  @ManyToMany(() => Project, project => project.users)
  @JoinTable()
  projects!: Promise<Project[]>

  @OneToMany(() => Session, session => session.user)
  sessions!: Promise<Session[]>

  @ManyToMany(() => Submission, submission => submission.users)
  submissions!: Promise<Submission[]>
}
