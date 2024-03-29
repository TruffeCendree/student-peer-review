import { useState } from 'react'

export function useDisabledAsync(cb: () => Promise<boolean>, opts: { onlyOnce?: boolean; disabled?: boolean } = {}) {
  const [disabled, setDisabled] = useState(false)

  function onClick() {
    setDisabled(true)
    cb()
      .then(success => (!opts.onlyOnce || !success) && setDisabled(false))
      .catch(() => setDisabled(false))
  }

  return { disabled: disabled || opts.disabled, onClick }
}
