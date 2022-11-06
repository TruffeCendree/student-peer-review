import * as xlsx from 'xlsx'
import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { Project } from '../entities/project'
import { User } from '../entities/user'
import { dataSource } from '../lib/typeorm'

async function run() {
  await dataSource.initialize()
  const argv = await yargs(hideBin(process.argv))
    .string('excelFile')
    .number('projectId')
    .demandOption('excelFile')
    .demandOption('projectId').argv

  const workbook = xlsx.readFile(argv.excelFile)
  const sheet = Object.values(workbook.Sheets)[0]

  const projectRepository = dataSource.getRepository(Project)
  const userRepository = dataSource.getRepository(User)

  const project = await projectRepository.findOneByOrFail({ id: argv.projectId })
  const projectUsers = await project.users

  for (let i = 2; i <= xlsx.utils.decode_range(sheet['!ref'] as string).e.r + 1; i++) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    projectUsers.push(await userRepository.findOneOrFail({ where: { email: sheet[`C${i}`].v as string } }))
  }

  project.users = Promise.resolve(projectUsers)
  await projectRepository.save(project)
  await dataSource.destroy()
}

run().catch(console.error)
