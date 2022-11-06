import { FastifyMultipartAttachFieldsToBodyOptions } from '@fastify/multipart'
import { MULTIPART_MAX_FILES, MULTIPART_MAX_SIZE } from './dotenv'

export const multipartConfig: FastifyMultipartAttachFieldsToBodyOptions = {
  limits: { fileSize: MULTIPART_MAX_SIZE, files: MULTIPART_MAX_FILES },
  attachFieldsToBody: true
}
