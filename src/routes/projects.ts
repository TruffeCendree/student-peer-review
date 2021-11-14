import { FastifyInstance } from 'fastify'
import { authorizeOfFail } from '../policies/policy'
import { canIndexProject, projectPolicyScope } from '../policies/projects-policy'
import { ProjectsIndexResponse } from '../schemas/types/projects.index.response'
import * as projectsIndexResponseSchema from '../schemas/json/projects.index.response.json'

export async function projectsRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    schema: {
      response: {
        200: projectsIndexResponseSchema
      }
    },
    handler: async function index(request): Promise<ProjectsIndexResponse> {
      await authorizeOfFail(canIndexProject, request.session, null)
      const projects = await projectPolicyScope(request.session!).getMany()
      return Promise.all(projects.map(async project => ({ ...project, users: await project.users })))
    }
  })
}
