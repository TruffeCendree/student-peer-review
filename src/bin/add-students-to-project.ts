import * as xlsx from 'xlsx'
import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { Project } from '../entities/project'
import { User } from '../entities/user'
import { initConnection } from '../lib/typeorm'

async function run () {
  const conn = await initConnection()
  const argv = await yargs(hideBin(process.argv))
    .string('excelFile')
    .number('projectId')
    .demandOption('excelFile')
    .demandOption('projectId')
    .argv

  const workbook = xlsx.readFile(argv.excelFile)
  const sheet = Object.values(workbook.Sheets)[0]
    
  const projectRepository = conn.getRepository(Project)
  const userRepository = conn.getRepository(User)

  const project = await projectRepository.findOneOrFail(argv.projectId)
  const projectUsers = await project.users

  for (let i = 2; i <= xlsx.utils.decode_range(sheet['!ref'] as string).e.r + 1; i++) {
    projectUsers.push(await userRepository.findOneOrFail({ where: { email: sheet[`C${i}`].v } }))
  }

  project.users = Promise.resolve(projectUsers)
  await projectRepository.save(project)
  await conn.close()
}

run().catch(console.error)
