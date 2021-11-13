import 'reflect-metadata'
import {
  DATABASE_HOST,
  DATABASE_LOGGING,
  DATABASE_NAME,
  DATABASE_PASS,
  DATABASE_PORT,
  DATABASE_SYNC,
  DATABASE_USER
} from './dotenv'
import { createConnection } from 'typeorm'
import { User } from '../entities/user'
import { Project } from '../entities/project'
import { Session } from '../entities/session'
import { Submission } from '../entities/submission'
import { Review } from '../entities/review'

export function initConnection() {
  return createConnection({
    type: 'mysql',
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USER,
    password: DATABASE_PASS,
    database: DATABASE_NAME,
    entities: [User, Project, Session, Submission, Review],
    synchronize: DATABASE_SYNC,
    logging: DATABASE_LOGGING,
    multipleStatements: true
  })
}
