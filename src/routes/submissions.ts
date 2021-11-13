import { FastifyInstance } from 'fastify'
import { Submission } from '../entities/submission'
import { User } from '../entities/user'
import { authorizeOfFail } from '../policies/policy'
import { canCreateSubmission } from '../policies/submissions-policy'
import { SubmissionsCreateBody } from '../schemas/types/submissions.create.body'
import * as submissionsCreateBodySchema from '../schemas/json/submissions.create.body.json'
import * as submissionsCreateResponseSchema from '../schemas/json/submissions.create.response.json'
import { getRepository } from 'typeorm'
import { Project } from '../entities/project'
import { MultipartFile } from 'fastify-multipart'
import { SubmissionsCreateResponse } from '../schemas/types/submissions.create.response'

export async function submissionsRoutes(fasify: FastifyInstance) {
  fasify.post<{ Body: SubmissionsCreateBody }>('/', {
    schema: {
      body: submissionsCreateBodySchema,
      response: { 200: submissionsCreateResponseSchema }
    },
    handler: async function create(request): Promise<SubmissionsCreateResponse> {
      const submission = new Submission()
      const project = await getRepository(Project).findOneOrFail(request.body.projectId.value)
      submission.user = Promise.resolve(request.session?.user as User)
      submission.project = Promise.resolve(project)
      await authorizeOfFail(canCreateSubmission, request.session, submission)
      await submission.setFile(request.body.file as any as MultipartFile)
      await getRepository(Submission).save(submission)
      return submission
    }
  })
}
