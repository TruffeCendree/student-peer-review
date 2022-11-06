import { Submission } from '../../entities/submission'
import { v4 as uuidv4 } from 'uuid'
import { User } from '../../entities/user'
import { buildUserFixture } from './users-fixtures'
import { Project } from '../../entities/project'
import { buildProjectFixture } from './projects-fixtures'
import { dataSource } from '../../lib/typeorm'

interface SubmissionFixtureOptions {
  user?: User
  project?: Project
  noProject?: boolean
}

export function buildSubmissionFixture(opts: SubmissionFixtureOptions = {}) {
  const submission = new Submission()
  submission.fileToken = `${uuidv4()}-test.txt`
  submission.users = Promise.resolve([opts.user || buildUserFixture()])
  if (!opts.noProject) submission.project = Promise.resolve(opts.project || buildProjectFixture())
  return submission
}

export async function createSubmissionFixture(opts: SubmissionFixtureOptions = {}) {
  return dataSource.getRepository(Submission).save(buildSubmissionFixture(opts))
}
