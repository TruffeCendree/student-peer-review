import * as React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useObservable } from 'hooks/use-obserable.hook'
import { errorsQuery } from 'queries/errors.query'
import { errorsStore } from 'stores/errors.store'

export function ErrorsTrailComponent() {
  const errors = useObservable(errorsQuery.selectAll(), [])
  if (!errors.length) return null

  return (
    <React.Fragment>
      {errors.map(error => (
        <Snackbar key={error.id} open autoHideDuration={20000} onClose={() => errorsStore.remove(error.id)}>
          <Alert
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
            children={error.message}
            onClose={() => errorsStore.remove(error.id)}
          />
        </Snackbar>
      ))}
    </React.Fragment>
  )
}
