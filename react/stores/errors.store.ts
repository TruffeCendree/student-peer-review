import { EntityState, EntityStore, StoreConfig } from '@datorama/akita'
import { HttpError } from 'services/http.service'

export interface ErrorsState extends EntityState<HttpError, number> {}

@StoreConfig({ name: 'errors' })
export class ErrorsStore extends EntityStore<ErrorsState> {
  constructor() {
    super()
    this.set([])
  }
}

export const errorsStore = new ErrorsStore()
