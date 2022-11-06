import { Review } from '../entities/review'
import { Session } from '../entities/session'
import { dataSource } from '../lib/typeorm'
import { PolicyAction, PolicyActionIndex, UnauthorizedError, UnloggedError } from './policy'

export const canIndexReview: PolicyActionIndex = async function canIndexReview(session) {
  if (!session) throw new UnloggedError()
  return true
}

export const canUpdateReview: PolicyAction<Review> = async function canUpdateReview(session, record) {
  if (!session) throw new UnloggedError()

  const isReviewer = !!(await dataSource.createQueryBuilder('submission_users_user', 'submission_users_user')
    .where({ submissionId: record.reviewerSubmissionId, userId: session.userId })
    .getRawOne())

  if (!isReviewer) throw new UnauthorizedError('You are not a reviewer of this submission')
  return true
}

export function reviewsPolicyScope(session: Session) {
  return dataSource.createQueryBuilder(Review, Review.name)
    .leftJoin('Review.reviewedSubmission', 'ReviewedSubmission')
    .leftJoin('Review.reviewerSubmission', 'ReviewerSubmission')
    .leftJoin('ReviewedSubmission.users', 'ReviewedSubmissionUsers')
    .leftJoin('ReviewerSubmission.users', 'ReviewerSubmissionUsers')
    .where('ReviewedSubmissionUsers.id = :userId OR ReviewerSubmissionUsers.id = :userId')
    .setParameter('userId', session.userId)
}
