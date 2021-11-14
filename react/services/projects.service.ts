import { httpGet } from './http.service'
import { ProjectsIndexResponse } from '@api/projects.index.response'
import { projectsStore } from 'stores/projects.store'

export async function loadProjects() {
  projectsStore.set(await httpGet<ProjectsIndexResponse>('/projects'))
}
