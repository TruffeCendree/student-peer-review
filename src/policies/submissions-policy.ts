import { createQueryBuilder } from 'typeorm'
import { Project } from '../entities/project'
import { Submission } from '../entities/submission'
import { User } from '../entities/user'
import { PolicyAction, UnauthorizedError, UnloggedError } from './policy'

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
