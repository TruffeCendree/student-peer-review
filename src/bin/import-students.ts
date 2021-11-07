import * as xlsx from 'xlsx'
import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { User } from '../entities/user'
import { initConnection } from '../lib/typeorm'

async function run () {
  const conn = await initConnection()
  const argv = await yargs(hideBin(process.argv)).string('excelFile').demandOption('excelFile').argv

  const workbook = xlsx.readFile(argv.excelFile)
  const sheet = Object.values(workbook.Sheets)[0]

  await conn.transaction(async entityManager => {
    for (let i = 2; i <= xlsx.utils.decode_range(sheet['!ref'] as string).e.r + 1; i++) {
      const user = await entityManager.getRepository(User).save({
        lastname: sheet[`A${i}`].v,
        firstname: sheet[`B${i}`].v,
        email: sheet[`C${i}`].v
      })

      console.log(user)
    }
  })

  await conn.close()
}

run().catch(console.error)
