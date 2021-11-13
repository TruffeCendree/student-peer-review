import { MultipartFile } from 'fastify-multipart'
import { v4 as uuidv4 } from 'uuid'
import { mkdir, writeFile } from 'fs/promises'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Project } from './project'
import { User } from './user'

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  fileUrl!: string

  @ManyToOne(() => User, user => user.submissions)
  user!: Promise<User>

  @ManyToOne(() => Project, project => project.submissions)
  project!: Promise<Project>

  async setFile(file: MultipartFile) {
    this.fileUrl = `public/submissions/${uuidv4()}-${file.filename}`
    await mkdir('public/submissions', { recursive: true })
    await writeFile(this.fileUrl, await file.toBuffer())
  }
}
