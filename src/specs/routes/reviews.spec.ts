import { expect } from 'chai'
import { server } from '../../lib/fastify'
import { ReviewsUpdateBody } from '../../schemas/types/reviews.update.body'
import { ReviewsSerialized } from '../../schemas/types/reviews.serialized'
import { createReviewFixture } from '../fixtures/reviews-fixtures'
import { createSessionFixture } from '../fixtures/sessions-fixtures'
import { loginAs } from '../spec-helper'
import { createSubmissionFixture } from '../fixtures/submissions-fixtures'
import { ReviewsIndexResponse } from '../../schemas/types/reviews.index.response'

describe('/reviews', function () {
  describe('#index', function () {
    it('should returns received and authored reviews', async function () {
      const session = await createSessionFixture()
      const userSubmission = await createSubmissionFixture({ user: session.user })
      const receivedReview = await createReviewFixture({ reviewedSubmission: userSubmission })
      const sentReview = await createReviewFixture({ reviewerSubmission: userSubmission })
      const notRelatedReview = await createReviewFixture()

      const response = await server.inject({ url: '/reviews', method: 'GET', cookies: loginAs(session) })
      expect(response.statusCode).to.eq(200)

      const json = response.json<ReviewsIndexResponse>()
      const reviewIds = json.map(_ => _.id)
      expect(reviewIds.length).to.eq(2)
      expect(reviewIds).to.have.members([receivedReview.id, sentReview.id])
      expect(reviewIds).to.not.include(notRelatedReview.id)
    })
  })

  describe('#update', function () {
    it('should update the review as reviewer', async function () {
      const review = await createReviewFixture()
      const [user] = await (await review.reviewerSubmission).users
      const cookies = loginAs(await createSessionFixture({ user }))
      const payload: ReviewsUpdateBody = { comment: 'Good job, amazing', comparison: 'strongly_better' }
      const response = await server.inject({ url: `/reviews/${review.id}`, method: 'PATCH', cookies, payload })
      expect(response.statusCode).to.eq(200)

      const json = response.json<ReviewsSerialized>()
      expect(json.id).to.eq(review.id)
      expect(json.comment).to.eq(payload.comment)
      expect(json.comparison).to.eq(payload.comparison)
    })
  })
})
