import * as repl from 'repl'
import { promisify } from 'util'
import { dataSource } from '../lib/typeorm'

async function run() {
  await dataSource.initialize()
  console.log('Current context includes a `dataSource` and typeorm entities.')

  const instance = repl.start('$ ')
  await promisify(instance.setupHistory.bind(instance))('.console_history')
  instance.on('exit', () => process.exit())

  instance.context.dataSource = dataSource
  for (const { name, target } of dataSource.entityMetadatas) instance.context[name] = target
}

run().catch(console.error)
