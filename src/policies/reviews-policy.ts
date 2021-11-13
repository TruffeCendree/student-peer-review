import { Review } from '../entities/review'
import { PolicyAction, UnauthorizedError, UnloggedError } from './policy'

export const canUpdateReview: PolicyAction<Review> = async function canUpdateReview(session, record) {
  if (!session) throw new UnloggedError()

  const isReviewer = (await record.reviewerSubmission).userId === session.userId
  if (!isReviewer) throw new UnauthorizedError('You are not a reviewer of this submission')

  return true
}
