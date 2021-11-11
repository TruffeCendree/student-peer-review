import { SwaggerOptions } from 'fastify-swagger'
import { PORT } from './dotenv'

export const swaggerConfig: SwaggerOptions = {
  mode: 'dynamic',
  routePrefix: '/documentation',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Swagger documentation',
      description: process.env.npm_package_description as string,
      version: process.env.npm_package_version as string
    },
    host: `localhost:${PORT}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
}
