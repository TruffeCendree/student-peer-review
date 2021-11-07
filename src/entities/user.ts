import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Project } from './project'

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
}
