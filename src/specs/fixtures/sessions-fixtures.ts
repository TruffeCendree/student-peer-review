import { getRepository } from 'typeorm'
import { Session } from '../../entities/session'
import { buildUserFixture } from './users-fixtures'
import * as faker from 'faker'
import { User } from '../../entities/user'

type SessionFixtureOptions = { user?: User }

export function buildSessionFixture(opts: SessionFixtureOptions = {}) {
  const session = new Session()
  session.id = faker.random.alphaNumeric(64)
  session.user = opts.user || buildUserFixture()
  return session
}

export async function createSessionFixture(opts: SessionFixtureOptions = {}) {
  return getRepository(Session).save(buildSessionFixture(opts))
}
