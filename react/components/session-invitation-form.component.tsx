import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import * as React from 'react'
import { useDisabledAsync } from 'hooks/use-disabled-async.hook'
import { sendSessionInvite } from 'services/sessions.service'

export function SessionInvitationFormComponent() {
  const [email, setEmail] = React.useState('')

  const submitBtnAttrs = useDisabledAsync(
    async () => {
      await sendSessionInvite({ email })
      return true
    },
    { onlyOnce: true }
  )

  return (
    <Paper style={{ padding: '1em' }}>
      <TextField
        id="email-session-invitation"
        label="Your school email, must be pre-registred"
        variant="filled"
        fullWidth
        value={email}
        onChange={evt => setEmail(evt.target.value)}
      />

      <Button {...submitBtnAttrs} variant="contained" fullWidth style={{ marginTop: '1em' }}>
        Send me an invitation link
      </Button>
    </Paper>
  )
}
