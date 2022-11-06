import { Session } from '../../entities/session'
import { buildUserFixture } from './users-fixtures'
import { faker } from '@faker-js/faker'
import { User } from '../../entities/user'
import { dataSource } from '../../lib/typeorm'

type SessionFixtureOptions = { user?: User }

export function buildSessionFixture(opts: SessionFixtureOptions = {}) {
  const session = new Session()
  session.id = faker.random.alphaNumeric(64)
  session.user = opts.user || buildUserFixture()
  return session
}

export async function createSessionFixture(opts: SessionFixtureOptions = {}) {
  return dataSource.getRepository(Session).save(buildSessionFixture(opts))
}
