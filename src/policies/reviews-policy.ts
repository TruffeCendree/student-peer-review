import { createQueryBuilder } from 'typeorm'
import { Review } from '../entities/review'
import { PolicyAction, UnauthorizedError, UnloggedError } from './policy'

export const canUpdateReview: PolicyAction<Review> = async function canUpdateReview(session, record) {
  if (!session) throw new UnloggedError()

  const isReviewer = !!(await createQueryBuilder('submission_users_user', 'submission_users_user')
    .where({ submissionId: record.reviewerSubmissionId, userId: session.userId })
    .getRawOne())

  if (!isReviewer) throw new UnauthorizedError('You are not a reviewer of this submission')
  return true
}
