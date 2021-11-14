import * as React from 'react'
import { SubmissionsSerialized } from '@api/submissions.serialized'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Alert, { AlertColor } from '@mui/material/Alert'
import { ProjectsIndexResponse } from '@api/projects.index.response'
import { reviewsQuery } from 'queries/reviews.query'
import { useObservable } from 'hooks/use-obserable.hook'
import { ReviewsSerialized } from '@api/reviews.serialized'
import { submissionsQuery } from 'queries/submissions.query'

const comparisonToI18n: { [comparison in ReviewsSerialized['comparison']]: string } = {
  worse: 'The reviewers think your deliverable is less good than their one.',
  similar: 'The reviewers think your deliverable is similar to their one.',
  better: 'The reviewers think your deliverable is better than their one.'
}

const comparisonToSeverity: { [comparison in ReviewsSerialized['comparison']]: AlertColor } = {
  worse: 'error',
  similar: 'warning',
  better: 'success'
}

export function SubmissionShowOwned({
  submission,
  project
}: {
  submission: SubmissionsSerialized
  project: ProjectsIndexResponse[0]
}) {
  const areReviewsLoading = useObservable(reviewsQuery.selectLoading())
  const receivedReviews = useObservable(reviewsQuery.selectWhereReviewedSubmission(submission.id), [])
  const submissions = useObservable(submissionsQuery.selectAll())
  if (areReviewsLoading) return null

  return (
    <React.Fragment>
      <Typography style={{ fontWeight: 'bold' }}>
        Your delivery and received reviews&nbsp; (
        <a href={submission.fileUrl} target="_blank">
          Download my delivery
        </a>
        )
      </Typography>

      {receivedReviews.map(review => {
        const reviewerSubmission = submissions.find(_ => _.id === review.reviewerSubmissionId)
        const reviewerUsers = project.users.filter(user => reviewerSubmission.userIds.includes(user.id))

        return (
          <Paper key={review.id} style={{ padding: '1em', marginTop: '0.5em', background: '#f9f9f9' }}>
            {!review.comment && !review.comparison && (
              <Alert severity="info">A review has been planned, waiting for it...</Alert>
            )}

            {review.comparison && (
              <Alert severity={comparisonToSeverity[review.comparison]}>
                {comparisonToI18n[review.comparison]}&nbsp; Reviewed by{' '}
                {reviewerUsers.map(_ => _.firstname + ' ' + _.lastname).join(' and ')}.
              </Alert>
            )}

            {review.comment && (
              <TextField
                style={{ marginTop: '1em' }}
                fullWidth
                label="Comment let by the reviewers"
                multiline
                value={review.comment}
                disabled
              />
            )}
          </Paper>
        )
      })}

      {receivedReviews.length === 0 && (
        <Alert severity="info">Your delivery has not been assigned yet (no auto refresh).</Alert>
      )}
    </React.Fragment>
  )
}
