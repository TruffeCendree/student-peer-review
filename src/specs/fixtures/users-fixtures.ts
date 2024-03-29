import { User } from '../../entities/user'
import { faker } from '@faker-js/faker'
import { dataSource } from '../../lib/typeorm'

type UserFixtureOptions = Partial<Pick<User, 'loginToken'>>

export function buildUserFixture(opts: UserFixtureOptions = {}) {
  const user = new User()
  user.firstname = faker.name.firstName()
  user.lastname = faker.name.lastName()
  user.email = faker.internet.email()
  user.loginToken = opts.loginToken ?? null
  return user
}

export function createUserFixture(opts: UserFixtureOptions = {}) {
  return dataSource.getRepository(User).save(buildUserFixture(opts))
}
