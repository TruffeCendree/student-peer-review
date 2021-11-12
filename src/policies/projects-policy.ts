import { getConnection } from 'typeorm'
import { Project } from '../entities/project'
import { Session } from '../entities/session'
import { PolicyActionIndex } from './policy'

export const canIndexProject: PolicyActionIndex = async function canIndexProject(session) {
  return !!session
}

export async function projectPolicyScope(session: Session) {
  return getConnection()
    .createQueryBuilder(Project, 'project')
    .innerJoin('project.users', 'user')
    .where('user.id = :userId', { userId: session.user.id })
}
