import { QueryEntity } from '@datorama/akita'
import { ProjectsState, projectsStore } from '../stores/projects.store'

export class ProjectsQuery extends QueryEntity<ProjectsState> {}

export const projectsQuery = new ProjectsQuery(projectsStore)
