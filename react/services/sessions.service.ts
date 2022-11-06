import { SessionsInviteBody } from '@api/sessions.invite.body'
import { SessionsCreateBody } from '@api/sessions.create.body'
import { httpPost } from './http.service'

export function sendSessionInvite(body: SessionsInviteBody) {
  return httpPost('/sessions/invite', body)
}

export function createSession(body: SessionsCreateBody) {
  return httpPost('/sessions', body)
}
