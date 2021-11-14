import { UsersShowResponse } from '@api/users.show.response'
import { usersStore } from 'stores/users.store'
import { httpGet } from './http.service'

export function loadCurrentUser() {
  return httpGet<UsersShowResponse>('/users/me')
    .then(user => usersStore.update({ currentUser: user }))
    .finally(() => usersStore.update({ currentUserLoading: false }))
}
