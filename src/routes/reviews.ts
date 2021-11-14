import { FastifyInstance } from 'fastify'
import { ParamIdOnly } from '../schemas/types/param.id-only'
import * as paramIdOnlySchema from '../schemas/json/param.id-only.json'
import * as reviewsUpdateBodySchema from '../schemas/json/reviews.update.body.json'
import * as reviewsIndexResponseSchema from '../schemas/json/reviews.index.response.json'
import * as reviewsSerializedSchema from '../schemas/json/reviews.serialized.json'
import { ReviewsUpdateBody } from '../schemas/types/reviews.update.body'
import { ReviewsSerialized } from '../schemas/types/reviews.serialized'
import { authorizeOfFail } from '../policies/policy'
import { canIndexReview, canUpdateReview, reviewsPolicyScope } from '../policies/reviews-policy'
import { getRepository } from 'typeorm'
import { Review } from '../entities/review'
import { ReviewsIndexResponse } from '../schemas/types/reviews.index.response'

export async function reviewsRoutes(fastify: FastifyInstance) {
  fastify.addSchema(reviewsSerializedSchema)

  fastify.get('/', {
    schema: {
      response: { 200: reviewsIndexResponseSchema }
    },
    handler: async function (request): Promise<ReviewsIndexResponse> {
      await authorizeOfFail(canIndexReview, request.session, null)
      return reviewsPolicyScope(request.session!).getMany()
    }
  })

  fastify.patch<{
    Params: ParamIdOnly
    Body: ReviewsUpdateBody
  }>('/:id', {
    schema: {
      params: paramIdOnlySchema,
      body: reviewsUpdateBodySchema,
      response: { 200: reviewsSerializedSchema }
    },
    handler: async function update(request): Promise<ReviewsSerialized> {
      const review = await getRepository(Review).findOneOrFail(request.params.id)
      await authorizeOfFail(canUpdateReview, request.session, review)

      review.comment = request.body.comment
      review.comparison = request.body.comparison
      await getRepository(Review).save(review)
      return review
    }
  })
}
