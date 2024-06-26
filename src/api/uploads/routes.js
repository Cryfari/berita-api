const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/users/image',
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
        path: path.resolve(__dirname, 'file'),
      },
    },
  },
];

module.exports = routes;
