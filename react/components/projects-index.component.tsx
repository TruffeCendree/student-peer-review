import * as React from 'react'
import { useObservable } from 'hooks/use-obserable.hook'
import { projectsQuery } from 'queries/projects.query'
import { loadProjects } from 'services/projects.service'
import { ProjectShowComponent } from './project-show.component'
import { voidFuncPromise } from 'services/utils.service'

export function ProjectsIndexComponent() {
  const areProjectsLoading = useObservable(projectsQuery.selectLoading())
  const projects = useObservable(projectsQuery.selectAll())
  React.useEffect(voidFuncPromise(loadProjects), [])

  if (areProjectsLoading !== false) return null

  return (
    <div>
      {projects.map(project => (
        <ProjectShowComponent key={project.id} project={project} />
      ))}
    </div>
  )
}
