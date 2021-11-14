import * as React from 'react'
import { SubmissionsSerialized } from '@api/submissions.serialized'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import DownloadIcon from '@mui/icons-material/Download'
import Autocomplete from '@mui/material/Autocomplete'
import { ProjectsIndexResponse } from '@api/projects.index.response'
import { useObservable } from 'hooks/use-obserable.hook'
import { reviewsQuery } from 'queries/reviews.query'
import { updateReview } from 'services/reviews.service'
import { useDisabledAsync } from 'hooks/use-disabled-async.hook'
import { ReviewsSerialized } from '@api/reviews.serialized'
import { submissionsQuery } from 'queries/submissions.query'

const comparisonChoices = [
  { value: 'worse' as const, label: 'Their deliverable is less good than mine.' },
  { value: 'similar' as const, label: 'Their deliverable is similar to mine.' },
  { value: 'better' as const, label: 'Their deliverable is better than mine.' }
]

export function SubmissionShowReviewed({
  submission,
  project
}: {
  submission: SubmissionsSerialized
  project: ProjectsIndexResponse[0]
}) {
  const [receiverReview] = useObservable(reviewsQuery.selectWhereReviewerSubmission(submission.id), [])
  const [comparison, setComparison] = React.useState<ReviewsSerialized['comparison']>(null)
  const [comment, setComment] = React.useState('')

  React.useEffect(() => {
    setComparison(receiverReview?.comparison || null)
    setComment(receiverReview?.comment || '')
  }, [receiverReview])

  const submitBtnAttrs = useDisabledAsync(
    async () => {
      await updateReview(receiverReview.id, { comparison, comment })
      return true
    },
    { disabled: !comparison || !comment }
  )

  if (!receiverReview) return null

  const reviewedUserNames = project.users
    .filter(user => submission.userIds.includes(user.id))
    .map(_ => _.firstname + ' ' + _.lastname)
    .join(' and ')

  return (
    <React.Fragment>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item>
          <Button component="a" href={submission.fileUrl} target="_blank">
            <DownloadIcon style={{ marginRight: '0.5em' }} /> Download
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Autocomplete
            value={comparisonChoices.find(choice => choice.value === comparison) || null}
            options={comparisonChoices}
            onChange={(ev, val: typeof comparisonChoices[0]) => setComparison(val?.value)}
            renderInput={params => <TextField {...params} label="How does it compare to your work?" />}
          />
        </Grid>

        <Grid item>
          <Button {...submitBtnAttrs} variant="contained">
            {receiverReview.comparison ? 'Update' : 'Submit'}
          </Button>
        </Grid>
      </Grid>

      <TextField
        style={{ marginTop: '1em' }}
        fullWidth
        label={`Let a comment to ${reviewedUserNames} (mentionning both good and weaker concerns, questions...)`}
        multiline
        value={comment}
        onChange={evt => setComment(evt.target.value)}
        variant="filled"
      />
    </React.Fragment>
  )
}
