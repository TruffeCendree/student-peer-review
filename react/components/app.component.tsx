import * as React from 'react'
import Container from '@mui/material/Container'
import { ProjectsIndexComponent } from './projects-index.component'
import { useObservable } from 'hooks/use-obserable.hook'
import { usersQuery } from 'queries/users.query'
import { loadCurrentUser } from 'services/users.service'
import { voidFuncPromise } from 'services/utils.service'
import { ErrorsTrailComponent } from './errors-trail.component'
import { SessionInvitationFormComponent } from './session-invitation-form.component'

export function AppComponent() {
  const isCurrentUserLoading = useObservable(usersQuery.currentUserLoading$)
  const currentUser = useObservable(usersQuery.currentUser$)
  React.useEffect(voidFuncPromise(loadCurrentUser), [])
  if (isCurrentUserLoading) return null

  return (
    <Container maxWidth={currentUser ? 'md' : 'sm'} style={{ marginTop: '3em' }}>
      <ErrorsTrailComponent />
      {currentUser ? <ProjectsIndexComponent /> : <SessionInvitationFormComponent />}
    </Container>
  )
}
