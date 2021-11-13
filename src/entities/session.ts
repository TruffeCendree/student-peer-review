import { Entity, ManyToOne, PrimaryColumn, RelationId } from 'typeorm'
import { User } from './user'

@Entity()
export class Session {
  @PrimaryColumn()
  id!: string

  @ManyToOne(() => User, { eager: true, cascade: ['insert'] })
  user!: User

  @RelationId((session: Session) => session.user)
  userId!: number
}
