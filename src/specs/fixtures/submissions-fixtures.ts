import { Submission } from '../../entities/submission'
import { v4 as uuidv4 } from 'uuid'
import { User } from '../../entities/user'
import { buildUserFixture } from './users-fixtures'
import { getRepository } from 'typeorm'

type SubmissionFixtureOptions = { user?: User }

export function buildSubmissionFixture(opts: SubmissionFixtureOptions = {}) {
  const submission = new Submission()
  submission.fileUrl = `public/submissions/${uuidv4()}-test.txt`
  submission.user = Promise.resolve(opts.user || buildUserFixture())
  return submission
}

export async function createSubmissionFixture(opts: SubmissionFixtureOptions = {}) {
  return getRepository(Submission).save(buildSubmissionFixture(opts))
}
