import { getRepository } from 'typeorm'
import { Review } from '../../entities/review'
import { buildSubmissionFixture } from './submissions-fixtures'

export function buildReviewFixture() {
  const review = new Review()
  review.reviewedSubmission = Promise.resolve(buildSubmissionFixture())
  review.reviewerSubmission = Promise.resolve(buildSubmissionFixture())
  return review
}

export function createReviewFixture() {
  return getRepository(Review).save(buildReviewFixture())
}
