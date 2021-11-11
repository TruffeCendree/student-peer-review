import { Session } from '../entities/session'

export interface PolicyAction<Model> {
  (currentSession: Session | null | undefined, record: Model): Promise<boolean | UnauthorizedError>
}

export class UnauthorizedError extends Error {}

export async function authorizeOfFail<Model>(
  policyAction: PolicyAction<Model>,
  currentSession: Session | null | undefined,
  record: Model
) {
  const resultOrError = await policyAction(currentSession, record)
  if (resultOrError instanceof UnauthorizedError) throw resultOrError
  if (!resultOrError) throw new UnauthorizedError('You are not allowed to perform this action')
  return true
}
