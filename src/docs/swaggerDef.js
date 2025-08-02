const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Bean Vibes API Documentation',
    description: 'API documentation for Bean Vibes - A coffee shop discovery and review platform',
    version,
    contact: {
      name: 'Bean Vibes Team',
      email: 'support@beanvibes.com',
    },
    license: {
      name: 'MIT',
      url: 'https://github.com/bean-vibes/api/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development server',
    },
    {
      url: 'https://api.beanvibes.com/v1',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints',
    },
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'Places',
      description: 'Coffee shop and place management endpoints',
    },
    {
      name: 'Reviews',
      description: 'Review management endpoints',
    },
    {
      name: 'Comments',
      description: 'Comment management endpoints',
    },
    {
      name: 'Ratings',
      description: 'Rating management endpoints',
    },
    {
      name: 'Categories',
      description: 'Category management endpoints',
    },
    {
      name: 'Upload',
      description: 'File upload endpoints',
    },
    {
      name: 'Reports',
      description: 'Report management endpoints',
    },
    {
      name: 'Reactions',
      description: 'Reaction management endpoints',
    },
    {
      name: 'Address',
      description: 'Address and location endpoints',
    },
    {
      name: 'Moderator',
      description: 'Moderator request endpoints',
    },
    {
      name: 'Restricted Words',
      description: 'Content filtering endpoints',
    },
  ],
};

module.exports = swaggerDef;
