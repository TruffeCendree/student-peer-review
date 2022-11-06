import { Project } from '../../entities/project'
import { User } from '../../entities/user'
import { faker } from '@faker-js/faker'
import { buildUserFixture } from './users-fixtures'
import { buildSubmissionFixture } from './submissions-fixtures'
import { dataSource } from '../../lib/typeorm'

type ProjectFixtureOptions = ({ users?: User[] } | { userCount?: number }) & { withSubmission?: boolean }

export async function buildProjectFixture(opts: ProjectFixtureOptions = {}) {
  const project = new Project()
  project.name = faker.company.name()
  project.instructions = faker.lorem.paragraphs(2)

  if ('users' in opts && opts.users) {
    project.users = Promise.resolve(opts.users)
  } else if ('userCount' in opts && opts.userCount) {
    project.users = Promise.resolve(new Array(opts.userCount).fill(null).map(() => buildUserFixture()))
  }

  if (opts.withSubmission) {
    if (!(await project.users)) throw new Error('opts.withSubmission requires that users are assigned to the project')
    project.submissions = project.users.then(users =>
      users.map(user => buildSubmissionFixture({ user, noProject: true }))
    )
  }

  return project
}

export async function createProjectFixture(opts: ProjectFixtureOptions = {}) {
  return dataSource.getRepository(Project).save(await buildProjectFixture(opts))
}
