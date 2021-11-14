import { createQueryBuilder } from 'typeorm'
import { Project } from '../entities/project'
import { Session } from '../entities/session'
import { PolicyActionIndex, UnloggedError } from './policy'

export const canIndexProject: PolicyActionIndex = async function canIndexProject(session) {
  if (!session) throw new UnloggedError()
  return true
}

export function projectPolicyScope(session: Session) {
  return createQueryBuilder(Project, Project.name)
    .innerJoin('user_projects_project', 'user_projects_project', 'user_projects_project.projectId = Project.id')
    .where('user_projects_project.userId = :userId', { userId: session.userId })
}
