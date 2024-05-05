import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';
import logger from './logger'
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FS Stockpilot API Docs',
      version,
      description: 'RESTful API for Full Scale inventory management system.'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Asset', description: 'Operations related to inventory assets' },
      { name: 'User', description: 'Operations related to users' },
      { name: 'Auth', description: 'Operations related to authentication and authorization' },
    ],
  },
  apis: [
    path.resolve(__dirname, '../routes/*.ts'),
    path.resolve(__dirname, '../models/*.schema.ts')
  ],
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app: Express, port: number) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  
  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  logger.info(`Docs available at http://localhost:${port}/docs`)
}

export default swaggerDocs;