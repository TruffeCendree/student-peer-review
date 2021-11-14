export function voidFuncPromise(cb: () => Promise<void>) {
  return () => {
    cb()
  }
}
