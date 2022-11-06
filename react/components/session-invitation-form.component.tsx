import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import * as React from 'react'
import { useDisabledAsync } from 'hooks/use-disabled-async.hook'
import { createSession, sendSessionInvite } from 'services/sessions.service'
import { loadCurrentUser } from 'services/users.service'

export function SessionInvitationFormComponent() {
  const [email, setEmail] = React.useState('')
  const [code, setCode] = React.useState('')
  const [sent, setSent] = React.useState(false)

  const sendCodeButtonAttrs = useDisabledAsync(
    async () => {
      await sendSessionInvite({ email })
      setSent(true)
      return true
    },
    { onlyOnce: true }
  )

  const establishSessionButtonAttrs = useDisabledAsync(
    async () => {
      await createSession({ token: code })
      await loadCurrentUser()
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

      { !sent && <Button {...sendCodeButtonAttrs} variant="contained" fullWidth style={{ marginTop: '1em' }}>
        Send me an invitation link
      </Button> }

      { sent && <React.Fragment>
        <TextField
          id="code-received-per-email"
          label="Please copy-paste the code received per email"
          variant="filled"
          fullWidth
          value={code}
          onChange={evt => setCode(evt.target.value)}
        />

        <Button {...establishSessionButtonAttrs} variant="contained" fullWidth style={{ marginTop: '1em' }}>
          Create session with token
        </Button>
      </React.Fragment> }
    </Paper>
  )
}
