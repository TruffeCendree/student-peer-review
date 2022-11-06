import { Review } from '../../entities/review'
import { Submission } from '../../entities/submission'
import { dataSource } from '../../lib/typeorm'
import { buildSubmissionFixture } from './submissions-fixtures'

interface ReviewFixtureOptions {
  reviewedSubmission?: Submission
  reviewerSubmission?: Submission
}

export function buildReviewFixture(opts: ReviewFixtureOptions = {}) {
  const review = new Review()
  review.reviewedSubmission = Promise.resolve(opts.reviewedSubmission || buildSubmissionFixture())
  review.reviewerSubmission = Promise.resolve(opts.reviewerSubmission || buildSubmissionFixture())
  return review
}

export function createReviewFixture(opts: ReviewFixtureOptions = {}) {
  return dataSource.getRepository(Review).save(buildReviewFixture(opts))
}
