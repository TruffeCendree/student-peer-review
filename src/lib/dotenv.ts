import { config } from 'dotenv'
import * as path from 'path'

export const NODE_ENV = getOrThrow('NODE_ENV') as 'test' | 'production'

// config() does not override loaded env variable, so load overrides first
if (NODE_ENV === 'test') config({ path: path.resolve(process.cwd(), '.env.test') })
config()

export const PORT = parseInt(process.env.PORT || '8080', 10)
export const FASTIFY_LOGGING = process.env.FASTIFY_LOGGING === 'true'
export const DATABASE_HOST = getOrThrow('DATABASE_HOST')
export const DATABASE_PORT = parseInt(getOrThrow('DATABASE_PORT'), 10)
export const DATABASE_USER = getOrThrow('DATABASE_USER')
export const DATABASE_PASS = getOrThrow('DATABASE_PASS')
export const DATABASE_NAME = getOrThrow('DATABASE_NAME')
export const DATABASE_LOGGING = process.env.DATABASE_LOGGING === 'true'
export const DATABASE_SYNC = process.env.DATABASE_SYNC === 'true'
export const COOKIE_NAME = getOrThrow('COOKIE_NAME')
export const COOKIE_SECRET = getOrThrow('COOKIE_SECRET')
export const COOKIE_SIGNED = process.env.COOKIE_SIGNED === 'true'
export const COOKIE_HTTP_ONLY = process.env.COOKIE_HTTP_ONLY === 'true'
export const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true'

function getOrThrow(name: string) {
  const val = process.env[name]
  if (typeof val === 'undefined') throw new Error(`Missing mandatory environment variable ${name}`)
  return val
}
