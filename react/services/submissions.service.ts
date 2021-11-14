import { httpPostMultipart } from './http.service'

export async function createSubmision(file: File, projectId: number, userIds) {
  const formData = new FormData()
  formData.append('projectId', projectId.toString())
  formData.append('file', file)
  for (const id of userIds) formData.append('userIds[]', id)
  await httpPostMultipart('/submissions', formData)
}
