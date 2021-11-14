import { EntityState, EntityStore, StoreConfig } from '@datorama/akita'
import { ProjectsIndexResponse } from '@api/projects.index.response'

export interface ProjectsState extends EntityState<ProjectsIndexResponse[0], number> {}

@StoreConfig({ name: 'projects' })
export class ProjectsStore extends EntityStore<ProjectsState> {}

export const projectsStore = new ProjectsStore()
