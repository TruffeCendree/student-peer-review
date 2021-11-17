import * as React from 'react'
import { ProjectsIndexResponse } from '@api/projects.index.response'
import { SubmissionCreateFormComponent } from './submission-create-form.component'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CodeIcon from '@mui/icons-material/Code'
import { useObservable } from 'hooks/use-obserable.hook'
import { submissionsQuery } from 'queries/submissions.query'
import { SubmissionShowOwned } from './submission-show-owned.component'
import { SubmissionShowReviewed } from './submission-show-reviewed.component'
import { Alert } from '@mui/material'

export function ProjectShowComponent({ project }: { project: ProjectsIndexResponse[0] }) {
  const ownedSubmission = useObservable(submissionsQuery.selectOwnedSubmissionOfProject(project.id), null)
  const reviewedSubmissions = useObservable(submissionsQuery.selectReviewedSubmissionsOfProject(project.id), [])

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <CodeIcon style={{ marginRight: '1em' }} />
        <Typography>{project.name}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {project.instructions && (
          <React.Fragment>
            <Typography style={{ fontWeight: 'bold' }}>Activity introduction</Typography>
            <Typography style={{ whiteSpace: 'pre-wrap' }}>{project.instructions}</Typography>
          </React.Fragment>
        )}

        <div style={{ padding: '1em 0' }}>
          {!ownedSubmission && <SubmissionCreateFormComponent project={project} />}
          {ownedSubmission && <SubmissionShowOwned submission={ownedSubmission} project={project} />}
        </div>

        <Typography style={{ fontWeight: 'bold' }}>Review your peer's deliveries</Typography>
        {reviewedSubmissions.map(submission => (
          <Paper key={submission.id} style={{ padding: '1em', marginTop: '0.5em', background: '#f9f9f9' }}>
            <SubmissionShowReviewed submission={submission} project={project} />
          </Paper>
        ))}

        {reviewedSubmissions.length === 0 && (
          <Alert severity="info">There is currently nothing to review. Please retry later.</Alert>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
