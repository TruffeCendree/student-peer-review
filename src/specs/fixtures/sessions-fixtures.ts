import { getRepository } from 'typeorm'
import { Session } from '../../entities/session'
import { buildUserFixture } from './users-fixtures'
import * as faker from 'faker'

export function buildSessionFixture() {
  const session = new Session()
  session.id = faker.random.alphaNumeric(64)
  session.user = buildUserFixture()
  return session
}

export async function createSessionFixture() {
  return getRepository(Session).save(buildSessionFixture())
}
