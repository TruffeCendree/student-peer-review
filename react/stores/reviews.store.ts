import { EntityState, EntityStore, StoreConfig } from '@datorama/akita'
import { ReviewsIndexResponse } from '@api/reviews.index.response'

export interface ReviewsState extends EntityState<ReviewsIndexResponse[0], number> {}

@StoreConfig({ name: 'reviews' })
export class ReviewsStore extends EntityStore<ReviewsState> {}

export const reviewsStore = new ReviewsStore()
