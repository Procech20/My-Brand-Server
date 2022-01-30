import swaggerJsDoc from 'swagger-jsdoc';
import swaggerui from 'swagger-ui-express';
import { Router } from 'express';

const docrouter = Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Brand Server',
      version: '1.0.0',
      description: 'A simple Express API for blog and users CRUD functionality',

      contact: {
        name: 'Prophete ISINGIZWE',
        url: 'https://my-brand-pro.netlify.app/',
        email: 'isingizwepro01@gmail.com',
      },

    },
    servers: [
        {
          url: 'http://localhost:5000',
          description: 'Local server'
        },
        {
          url: 'https://my-brand-pro.herokuapp.com/',
          description: 'Remote server'
        }
      ],
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  apis: ['./src/App/routes/*.js'],
};

const specs = swaggerJsDoc(options);

docrouter.use(
  '/',
  swaggerui.serve,
  swaggerui.setup(specs, { explorer: true }),
);

export default docrouter;
