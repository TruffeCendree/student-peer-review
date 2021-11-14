import * as React from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { ProjectsIndexResponse } from '@api/projects.index.response'
import { useDisabledAsync } from 'hooks/use-disabled-async.hook'
import { createSubmision } from 'services/submissions.service'
import { usersQuery } from 'queries/users.query'
import { useObservable } from 'hooks/use-obserable.hook'
import { usersStore } from 'stores/users.store'

type User = ProjectsIndexResponse[0]['users'][0]

export function SubmissionCreateFormComponent({ project }: { project: ProjectsIndexResponse[0] }) {
  const currentUser = useObservable(usersQuery.currentUser$, usersStore.getValue().currentUser)
  const [secondContributor, setSecondContributor] = React.useState<User>(null)
  const [file, setFile] = React.useState<File>(null)

  const submitBtnAttrs = useDisabledAsync(
    async () => {
      await createSubmision(file, project.id, secondContributor ? [secondContributor.id] : [])
      return true
    },
    { onlyOnce: true, disabled: !file }
  )

  if (!currentUser) return null

  return (
    <Paper elevation={2} style={{ padding: '1em' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <Autocomplete
            id="contributors"
            value={secondContributor}
            options={project.users.filter(_ => _.id !== currentUser.id)}
            getOptionLabel={user => user.lastname + ' ' + user.firstname}
            onChange={(ev, user) => setSecondContributor(user as User)}
            renderInput={params => <TextField {...params} label="Second contributor" />}
          />
        </Grid>

        <Grid item xs={5}>
          <Typography variant="caption">You are allowed to upload a single file up to 16MB.</Typography>
          <input type="file" onChange={evt => setFile(evt.target.files[0])} accept="application/zip" />
        </Grid>

        <Grid item xs={3} style={{ textAlign: 'right' }}>
          <Button {...submitBtnAttrs} variant="contained">
            Upload my work
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}
