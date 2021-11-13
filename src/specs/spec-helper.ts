import { sign } from 'cookie-signature'
import { getConnection } from 'typeorm'
import { Session } from '../entities/session'
import { COOKIE_NAME, COOKIE_SECRET } from '../lib/dotenv'
import { initConnection } from '../lib/typeorm'

before(async function () {
  await initConnection()
  await cleanupWith('truncation')
})

beforeEach(async function () {
  await cleanupWith('deletion')
})

/**
 * 'truncation' fully reset the database (including primary counters)
 * 'deletion' faster than 'truncation' with low count of entries, but do not reset counters.
 * 'transaction' is not yet implemented, but will be light-fast compared to the previous modes.
 */
async function cleanupWith(mode: 'truncation' | 'deletion') {
  const entities = getConnection().entityMetadatas
  const conn = getConnection()

  for (const entity of entities) {
    if (mode === 'truncation') await conn.query(`SET FOREIGN_KEY_CHECKS = 0; TRUNCATE ${entity.tableName}; SET FOREIGN_KEY_CHECKS = 1;`)
    else await conn.query(`SET FOREIGN_KEY_CHECKS = 0; DELETE FROM ${entity.tableName}; SET FOREIGN_KEY_CHECKS = 1;`)
  }
}

export function loginAs(session: Session) {
  return { [COOKIE_NAME]: sign(session.id, COOKIE_SECRET) }
}
