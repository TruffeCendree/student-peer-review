import * as repl from 'repl'
import { promisify } from 'util'
import { initConnection } from '../lib/typeorm'

async function run () {
  const conn = await initConnection()
  console.log('Current context includes a `conn` (Connection) and typeorm entities.')

  const instance = repl.start('$ ')
  await promisify(instance.setupHistory.bind(instance))('.console_history')
  instance.on('exit', () => process.exit())

  instance.context.conn = conn
  for (const { name, target } of conn.entityMetadatas) instance.context[name] = target
}

run().catch(console.error)
