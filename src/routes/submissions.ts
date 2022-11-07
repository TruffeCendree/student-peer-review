import { FastifyInstance } from 'fastify'
import { Submission } from '../entities/submission'
import { User } from '../entities/user'
import { authorizeOfFail } from '../policies/policy'
import { canCreateSubmission, submissionPolicyScope } from '../policies/submissions-policy'
import { SubmissionsCreateBody } from '../schemas/types/submissions.create.body'
import * as submissionsSerializedSchema from '../schemas/json/submissions.serialized.json'
import * as submissionsIndexResponse from '../schemas/json/submissions.index.response.json'
import * as submissionsCreateBodySchema from '../schemas/json/submissions.create.body.json'
import { Project } from '../entities/project'
import { MultipartFile } from '@fastify/multipart'
import { canIndexProject } from '../policies/projects-policy'
import { SubmissionsSerializedJson as SubmissionsSerialized } from '../schemas/types/submissions.serialized'
import { SubmissionsIndexResponse } from '../schemas/types/submissions.index.response'
import { dataSource } from '../lib/typeorm'
import { SubmissionsService } from '../services/submissions-service'

export async function submissionsRoutes(fastify: FastifyInstance) {
  fastify.addSchema(submissionsSerializedSchema)

  fastify.get('/', {
    schema: {
      response: { 200: submissionsIndexResponse }
    },
    handler: async function index(request): Promise<SubmissionsIndexResponse> {
      await authorizeOfFail(canIndexProject, request.session, null)
      const submissionsService = new SubmissionsService(dataSource.manager)
      const submissions = await submissionPolicyScope(request.session!).getMany()
      return Promise.all(submissions.map(_ => submissionsService.serialize(_)))
    }
  })

  fastify.post<{ Body: SubmissionsCreateBody }>('/', {
    schema: {
      body: submissionsCreateBodySchema,
      response: { 200: submissionsSerializedSchema }
    },
    handler: async function create(request): Promise<SubmissionsSerialized> {
      const submission = new Submission()
      const submissionsService = new SubmissionsService(dataSource.manager)
      const project = await dataSource.getRepository(Project).findOneByOrFail({ id: request.body.projectId.value })
      const users = [request.session?.user as User]

      if (request.body['userIds[]']) {
        const userIds = Array.isArray(request.body['userIds[]'])
          ? request.body['userIds[]'].map(_ => _.value)
          : [request.body['userIds[]'].value]
        users.push(...(await dataSource.getRepository(User).findByIds(userIds)))
      }

      submission.users = Promise.resolve(users)
      submission.project = Promise.resolve(project)
      await authorizeOfFail(canCreateSubmission, request.session, submission)
      await submissionsService.setFile(submission, request.body.file as any as MultipartFile)
      await dataSource.getRepository(Submission).save(submission)
      return submissionsService.serialize(submission)
    }
  })
}
