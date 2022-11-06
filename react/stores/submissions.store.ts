import { EntityState, EntityStore, StoreConfig } from '@datorama/akita'
import { SubmissionsSerializedJson as SubmissionsSerialized } from '@api/submissions.serialized'

export interface SubmissionsState extends EntityState<SubmissionsSerialized, number> {}

@StoreConfig({ name: 'submissions' })
export class SubmissionsStore extends EntityStore<SubmissionsState> {}

export const submissionsStore = new SubmissionsStore()
