import { createQueryBuilder } from 'typeorm'
import { Project } from '../entities/project'
import { Review } from '../entities/review'
import { Session } from '../entities/session'
import { Submission } from '../entities/submission'
import { User } from '../entities/user'
import { PolicyAction, PolicyActionIndex, UnauthorizedError, UnloggedError } from './policy'

export const canIndexProject: PolicyActionIndex = async function canIndexProject(session) {
  return !!session
}

export const canCreateSubmission: PolicyAction<Submission> = async function canCreateSubmission(session, record) {
  if (!session) throw new UnloggedError()

  const existingSubmission = await (await record.project).getSubmissionForUser(session.user)
  if (existingSubmission) throw new UnauthorizedError('You already submitted your job for this project')

  if (!(await isUserRegistredToProject(session.user, await record.project))) {
    throw new UnauthorizedError('You are not registred on that project')
  }

  return true
}

async function isUserRegistredToProject(user: User, project: Project) {
  return !!(await createQueryBuilder('user_projects_project', 'user_projects_project')
    .where({ userId: user.id, projectId: project.id })
    .getRawOne())
}

export function submissionPolicyScope(session: Session) {
  // An user can see both its own submissions and the submissions it should review
  return createQueryBuilder(Submission, Submission.name)
    .leftJoin(Review, 'Review', 'Review.reviewedSubmissionId = Submission.id')
    .leftJoin(Submission, 'ReviewerSubmission', 'ReviewerSubmission.id = Review.reviewerSubmissionId')
    .leftJoin('submission_users_user', 'SubmissionUser', 'SubmissionUser.submissionId = Submission.id')
    .leftJoin(
      'submission_users_user',
      'ReviewerSubmissionUser',
      'ReviewerSubmissionUser.submissionId = ReviewerSubmission.id'
    )
    .where('SubmissionUser.userId = :userId OR ReviewerSubmissionUser.userId = :userId')
    .setParameter('userId', session.userId)
}
