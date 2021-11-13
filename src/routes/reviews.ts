import { FastifyInstance } from 'fastify'
import { ParamIdOnly } from '../schemas/types/param.id-only'
import * as paramIdOnlySchema from '../schemas/json/param.id-only.json'
import * as reviewsUpdateBodySchema from '../schemas/json/reviews.update.body.json'
import * as reviewsUpdateResponseSchema from '../schemas/json/reviews.update.response.json'
import { ReviewsUpdateBody } from '../schemas/types/reviews.update.body'
import { ReviewsUpdateResponse } from '../schemas/types/reviews.update.response'
import { authorizeOfFail } from '../policies/policy'
import { canUpdateReview } from '../policies/reviews-policy'
import { getRepository } from 'typeorm'
import { Review } from '../entities/review'

export async function reviewsRoutes(fastify: FastifyInstance) {
  fastify.patch<{
    Params: ParamIdOnly
    Body: ReviewsUpdateBody
  }>('/:id', {
    schema: {
      params: paramIdOnlySchema,
      body: reviewsUpdateBodySchema,
      response: { 200: reviewsUpdateResponseSchema }
    },
    handler: async function update(request): Promise<ReviewsUpdateResponse> {
      const review = await getRepository(Review).findOneOrFail(request.params.id)
      await authorizeOfFail(canUpdateReview, request.session, review)

      review.comment = request.body.comment
      review.comparison = request.body.comparison
      await getRepository(Review).save(review)
      return review
    }
  })
}
