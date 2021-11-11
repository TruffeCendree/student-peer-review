import { getConnection } from 'typeorm'
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

  await conn.query('SET FOREIGN_KEY_CHECKS = 0;')

  for (const entity of entities) {
    if (mode === 'truncation') await conn.query(`TRUNCATE ${entity.tableName};`)
    else await conn.query(`DELETE FROM ${entity.tableName};`)
  }

  await conn.query('SET FOREIGN_KEY_CHECKS = 1;')
}
