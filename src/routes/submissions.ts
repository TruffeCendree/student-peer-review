import { FastifyInstance } from 'fastify'
import { Submission } from '../entities/submission'
import { User } from '../entities/user'
import { authorizeOfFail } from '../policies/policy'
import { canCreateSubmission, submissionPolicyScope } from '../policies/submissions-policy'
import { SubmissionsCreateBody } from '../schemas/types/submissions.create.body'
import * as submissionsSerializedSchema from '../schemas/json/submissions.serialized.json'
import * as submissionsIndexResponse from '../schemas/json/submissions.index.response.json'
import * as submissionsCreateBodySchema from '../schemas/json/submissions.create.body.json'
import { getRepository } from 'typeorm'
import { Project } from '../entities/project'
import { MultipartFile } from 'fastify-multipart'
import { canIndexProject } from '../policies/projects-policy'
import { SubmissionsSerialized } from '../schemas/types/submissions.serialized'
import { SubmissionsIndexResponse } from '../schemas/types/submissions.index.response'

export async function submissionsRoutes(fastify: FastifyInstance) {
  fastify.addSchema(submissionsSerializedSchema)

  fastify.get('/', {
    schema: {
      response: { 200: submissionsIndexResponse }
    },
    handler: async function index(request): Promise<SubmissionsIndexResponse> {
      await authorizeOfFail(canIndexProject, request.session, null)
      return submissionPolicyScope(request.session!).getMany()
    }
  })

  fastify.post<{ Body: SubmissionsCreateBody }>('/', {
    schema: {
      body: submissionsCreateBodySchema,
      response: { 200: submissionsSerializedSchema }
    },
    handler: async function create(request): Promise<SubmissionsSerialized> {
      const submission = new Submission()
      const project = await getRepository(Project).findOneOrFail(request.body.projectId.value)

      const users = [request.session?.user as User]
      if (request.body['userIds[]']?.length) {
        users.push(...await getRepository(User).findByIds(request.body['userIds[]'].map(_ => _.value)))
      }

      submission.users = Promise.resolve(users)
      submission.project = Promise.resolve(project)
      await authorizeOfFail(canCreateSubmission, request.session, submission)
      await submission.setFile(request.body.file as any as MultipartFile)
      await getRepository(Submission).save(submission)
      return submission
    }
  })
}
