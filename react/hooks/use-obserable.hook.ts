import { useEffect, useState } from 'react'
import { Observable } from 'rxjs'

export function useObservable<T>(observable: Observable<T>, init?: T): T {
  const [value, setValue] = useState<T>(init)

  useEffect(() => {
    const subscription = observable.subscribe(setValue)
    return subscription.unsubscribe.bind(subscription)
  }, [])

  return value
}
