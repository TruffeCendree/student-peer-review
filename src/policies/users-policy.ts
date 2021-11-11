import { User } from '../entities/user'
import { PolicyAction } from './policy'

export const canShowUser: PolicyAction<User> = async function canShow(session, record) {
  return !!session && session.user.id === record.id
}
