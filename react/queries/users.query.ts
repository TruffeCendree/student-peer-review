import { QueryEntity } from '@datorama/akita'
import { UsersState, usersStore } from '../stores/users.store'

export class UsersQuery extends QueryEntity<UsersState> {
  currentUserLoading$ = this.select('currentUserLoading')
  currentUser$ = this.select('currentUser')
}

export const usersQuery = new UsersQuery(usersStore)
