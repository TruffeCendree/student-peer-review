import { expect } from 'chai'
import { server } from '../../lib/fastify'
import { ReviewsUpdateBody } from '../../schemas/types/reviews.update.body'
import { ReviewsUpdateResponse } from '../../schemas/types/reviews.update.response'
import { createReviewFixture } from '../fixtures/reviews-fixtures'
import { createSessionFixture } from '../fixtures/sessions-fixtures'
import { loginAs } from '../spec-helper'

describe('/reviews', function () {
  describe('#update', function () {
    it('should update the review as reviewer', async function () {
      const review = await createReviewFixture()
      const [user] = await (await review.reviewerSubmission).users
      const cookies = loginAs(await createSessionFixture({ user }))
      const payload: ReviewsUpdateBody = { comment: 'Good job, amazing', comparison: 'better' }
      const response = await server.inject({ url: `/reviews/${review.id}`, method: 'PATCH', cookies, payload })
      expect(response.statusCode).to.eq(200)

      const json = response.json<ReviewsUpdateResponse>()
      expect(json.id).to.eq(review.id)
      expect(json.comment).to.eq(payload.comment)
      expect(json.comparison).to.eq(payload.comparison)
    })
  })
})
