import { Session } from '../entities/session'

export interface PolicyAction<Model> {
  (currentSession: Session | null | undefined, record: Model): Promise<boolean | UnauthorizedError>
}

export interface PolicyActionIndex {
  (currentSession: Session | null | undefined): Promise<boolean | UnauthorizedError>
}

export class UnauthorizedError extends Error {}

export class UnloggedError extends UnauthorizedError {
  constructor() {
    super('You are not logged in')
  }
}

export async function authorizeOfFail<Model>(
  policyAction: PolicyAction<Model> | PolicyActionIndex,
  currentSession: Session | null | undefined,
  record: Model
) {
  const resultOrError = await policyAction(currentSession, record)
  if (resultOrError instanceof UnauthorizedError) throw resultOrError
  if (!resultOrError) throw new UnauthorizedError('You are not allowed to perform this action')
  return true
}
