const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Generic Storefront',
    description: 'A generic storefront API.',
  },
  tags: [
    {
      name: 'Account Management',
      description: 'A suite of APIs for managing accounts stored in the database.',
    },
    {
      name: 'Product Management',
      description: 'A suite of APIs for managing products stored in the database.',
    }
  ],
  securityDefinitions: {
    oAuth: {
      type: 'oauth2',
      description: 'The authorization method used by this backend runs on Auth0.',
      authorizationUrl: 'https://cse341-b.onrender.com/login'
    }
  },
  host: 'cse341-b.onrender.com',
  schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);