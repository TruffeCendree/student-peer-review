import { getRepository } from 'typeorm'
import { Project } from '../../entities/project'
import { User } from '../../entities/user'
import * as faker from 'faker'

type ProjectFixtureOptions = { users?: User[] }

export function buildProjectFixture(opts: ProjectFixtureOptions = {}) {
  const project = new Project()
  project.name = faker.company.companyName()
  project.instructions = faker.lorem.paragraphs(2)
  if (opts.users) project.users = Promise.resolve(opts.users)
  return project
}

export function createProjectFixture(opts: ProjectFixtureOptions = {}) {
  return getRepository(Project).save(buildProjectFixture(opts))
}
