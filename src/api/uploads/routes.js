const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/users/{id}/image',
    handler: handler.postUploadImageUserHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
      auth: 'k12news_jwt',
    },
  },
  {
    method: 'GET',
    path: '/users/image/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'avatar'),
      },
    },
  },
];

module.exports = routes;
