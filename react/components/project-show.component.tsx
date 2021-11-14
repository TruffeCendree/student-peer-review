import * as React from 'react'
import { ProjectsIndexResponse } from '@api/projects.index.response'
import { SubmissionCreateFormComponent } from './submission-create-form.component'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CodeIcon from '@mui/icons-material/Code'

export function ProjectShowComponent({ project }: { project: ProjectsIndexResponse[0] }) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <CodeIcon style={{ marginRight: '1em' }} />
        <Typography>{project.name}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Typography style={{ whiteSpace: 'pre-wrap' }} paragraph>
          {project.instructions}
        </Typography>

        <Divider style={{ marginBottom: '1em' }} />

        <SubmissionCreateFormComponent project={project} />
      </AccordionDetails>
    </Accordion>
  )
}
