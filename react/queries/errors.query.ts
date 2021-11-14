import { QueryEntity } from '@datorama/akita'
import { ErrorsState, errorsStore } from '../stores/errors.store'

export class ErrorsQuery extends QueryEntity<ErrorsState> {}

export const errorsQuery = new ErrorsQuery(errorsStore)
