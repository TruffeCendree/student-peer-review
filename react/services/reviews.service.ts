import { httpGet, httpPatch } from './http.service'
import { ReviewsIndexResponse } from '@api/reviews.index.response'
import { ReviewsSerializedJson as ReviewsSerialized } from '@api/reviews.serialized'
import { ReviewsUpdateBody } from '@api/reviews.update.body'
import { reviewsStore } from 'stores/reviews.store'

export async function loadReviews() {
  reviewsStore.set(await httpGet<ReviewsIndexResponse>('/reviews'))
}

export async function updateReview(id: number, body: ReviewsUpdateBody) {
  reviewsStore.update(id, await httpPatch<ReviewsSerialized>(`/reviews/${id}`, body))
}
