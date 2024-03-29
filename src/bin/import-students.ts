import * as xlsx from 'xlsx'
import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { User } from '../entities/user'
import { dataSource } from '../lib/typeorm'

async function run() {
  await dataSource.initialize()
  const argv = await yargs(hideBin(process.argv)).string('excelFile').demandOption('excelFile').argv

  const workbook = xlsx.readFile(argv.excelFile)
  const sheet = Object.values(workbook.Sheets)[0]

  await dataSource.transaction(async entityManager => {
    for (let i = 2; i <= xlsx.utils.decode_range(sheet['!ref'] as string).e.r + 1; i++) {
      await entityManager.getRepository(User).save({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        lastname: sheet[`A${i}`].v as string,

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        firstname: sheet[`B${i}`].v as string,

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        email: sheet[`C${i}`].v as string
      })
    }
  })

  await dataSource.destroy()
}

run().catch(console.error)
