import { httpGet, httpPostMultipart } from './http.service'
import { SubmissionsSerialized } from '@api/submissions.serialized'
import { SubmissionsIndexResponse } from '@api/submissions.index.response'
import { submissionsStore } from 'stores/submissions.store'

export async function loadSubmissions() {
  submissionsStore.set(await httpGet<SubmissionsIndexResponse>('/submissions'))
}

export async function createSubmision(file: File, projectId: number, userIds) {
  const formData = new FormData()
  formData.append('projectId', projectId.toString())
  formData.append('file', file)
  for (const id of userIds) formData.append('userIds[]', id)
  submissionsStore.add(await httpPostMultipart<SubmissionsSerialized>('/submissions', formData))
}
