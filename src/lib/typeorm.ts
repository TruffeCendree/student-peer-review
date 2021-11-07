import 'reflect-metadata'
import { DATABASE_HOST, DATABASE_LOGGING, DATABASE_NAME, DATABASE_PASS, DATABASE_PORT, DATABASE_SYNC, DATABASE_USER } from './dotenv'
import { createConnection } from 'typeorm'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { User } from '../entities/user'

export function createConnectionFromEnv (opts: Partial<MysqlConnectionOptions> = {}) {
  return createConnection({
    type: 'mysql',
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USER,
    password: DATABASE_PASS,
    database: DATABASE_NAME,
    entities: [ User ],
    synchronize: DATABASE_SYNC,
    logging: DATABASE_LOGGING,
    ...opts
  })
}
