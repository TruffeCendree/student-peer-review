import { MultipartFile } from "@fastify/multipart";
import { EntityManager } from "typeorm";
import { Submission } from "../entities/submission";
import { User } from "../entities/user";
import { UnauthorizedError } from "../policies/policy";
import { v4 as uuidv4 } from 'uuid'
import { mkdir, writeFile } from 'fs/promises'

export class SubmissionsService {
  constructor (private manager: EntityManager) {}

  getUsers$(submission: Submission) {
    return this.manager
      .createQueryBuilder(User, User.name)
      .innerJoin('User.submissions', Submission.name)
      .where('Submission.id = :submissionId')
      .setParameter('submissionId', submission.id)
  }

  getUserIds(submission: Submission) {
    return this.getUsers$(submission)
      .select('User.id')
      .getMany()
      .then(partialUsers => partialUsers.map(_ => _.id))
  }

  async setFile(submission: Submission, file: MultipartFile) {
    const lowerName = file.filename.toLocaleLowerCase()
    if (!lowerName.endsWith('.zip') && !lowerName.endsWith('.pdf')) {
      throw new UnauthorizedError('You can only upload a ZIP/PDF file')
    }

    submission.fileToken = `${uuidv4()}-${file.filename}`
    await mkdir('public/submissions', { recursive: true })
    await writeFile('public/submissions/' + submission.fileToken, await file.toBuffer())
  }

  async serialize (submission: Submission) {
    return {
      ...submission,
      fileUrl: submission.fileUrl,
      userIds: await this.getUserIds(submission)
    }
  }
}
