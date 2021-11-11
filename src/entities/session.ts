import { Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { User } from './user'

@Entity()
export class Session {
  @PrimaryColumn()
  id!: string

  @ManyToOne(() => User, { eager: true, cascade: ['insert'] })
  user!: User
}
