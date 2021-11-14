import { QueryEntity } from '@datorama/akita'
import { map } from 'rxjs'
import { ReviewsState, reviewsStore } from '../stores/reviews.store'

export class ReviewsQuery extends QueryEntity<ReviewsState> {
  selectWhereReviewedSubmission(submissionId: number) {
    return this.selectAll().pipe(map(reviews => reviews.filter(_ => _.reviewedSubmissionId === submissionId)))
  }

  selectWhereReviewerSubmission(submissionId: number) {
    return this.selectAll().pipe(map(reviews => reviews.filter(_ => _.reviewerSubmissionId === submissionId)))
  }
}

export const reviewsQuery = new ReviewsQuery(reviewsStore)
