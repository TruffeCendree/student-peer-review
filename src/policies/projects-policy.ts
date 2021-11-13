import { createQueryBuilder } from 'typeorm'
import { Project } from '../entities/project'
import { Session } from '../entities/session'
import { PolicyActionIndex } from './policy'

export const canIndexProject: PolicyActionIndex = async function canIndexProject(session) {
  return !!session
}

export async function projectPolicyScope(session: Session) {
  return createQueryBuilder(Project, Project.name)
    .innerJoin('user_projects_project', 'user_projects_project', 'user_projects_project.projectId = Project.id')
    .where('user_projects_project.userId = :userId', { userId: session.user.id })
}
