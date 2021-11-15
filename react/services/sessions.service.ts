import { SessionsInviteBody } from '@api/sessions.invite.body'
import { httpPost } from './http.service'

export function sendSessionInvite(body: SessionsInviteBody) {
  return httpPost('/sessions/invite', body)
}
