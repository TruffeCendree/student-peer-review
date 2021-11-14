import { EntityState, EntityStore, StoreConfig } from '@datorama/akita'
import { UsersShowResponse } from '@api/users.show.response'

export interface UsersState extends EntityState<UsersShowResponse, number> {
  currentUser: UsersShowResponse
  currentUserLoading: boolean
}

@StoreConfig({ name: 'users' })
export class UsersStore extends EntityStore<UsersState> {
  constructor() {
    super({ currentUser: null, currentUserLoading: true })
  }
}

export const usersStore = new UsersStore()
