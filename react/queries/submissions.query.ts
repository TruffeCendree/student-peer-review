import { QueryEntity } from '@datorama/akita'
import { SubmissionsState, submissionsStore } from '../stores/submissions.store'
import { combineLatest, map, filter } from 'rxjs'
import { usersQuery } from './users.query'

export class SubmissionsQuery extends QueryEntity<SubmissionsState> {
  private submissionsJoinsCurrentUser$ = combineLatest([this.selectAll(), usersQuery.currentUser$]).pipe(
    filter(([submissions, currentUser]) => !!submissions && !!currentUser)
  )

  ownedSubmission$ = this.submissionsJoinsCurrentUser$.pipe(
    map(([submissions, currentUser]) => submissions.find(submission => submission.userIds.includes(currentUser.id)))
  )

  reviewedSubmissions$ = this.submissionsJoinsCurrentUser$.pipe(
    map(([submissions, currentUser]) => submissions.filter(submission => !submission.userIds.includes(currentUser.id)))
  )
}

export const submissionsQuery = new SubmissionsQuery(submissionsStore)
