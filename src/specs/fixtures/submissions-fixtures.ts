import { Submission } from '../../entities/submission'
import { v4 as uuidv4 } from 'uuid'
import { User } from '../../entities/user'
import { buildUserFixture } from './users-fixtures'
import { getRepository } from 'typeorm'
import { Project } from '../../entities/project'
import { buildProjectFixture } from './projects-fixtures'

interface SubmissionFixtureOptions {
  user?: User
  project?: Project
  noProject?: boolean
}

export function buildSubmissionFixture(opts: SubmissionFixtureOptions = {}) {
  const submission = new Submission()
  submission.fileUrl = `public/submissions/${uuidv4()}-test.txt`
  submission.user = Promise.resolve(opts.user || buildUserFixture())
  if (!opts.noProject) submission.project = Promise.resolve(opts.project || buildProjectFixture())
  return submission
}

export async function createSubmissionFixture(opts: SubmissionFixtureOptions = {}) {
  return getRepository(Submission).save(buildSubmissionFixture(opts))
}
