const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/addnews',
    handler: handler.postAddNewsHandler,
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
    path: '/news/all',
    handler: handler.getAllNewsHandler,
  },
  {
    method: 'GET',
    path: '/news/{id}',
    handler: handler.getNewsByIdHandler,
  },
  {
    method: 'GET',
    path: '/news/category/{category}',
    handler: handler.getNewsByCategoryHandler,
  },
  {
    method: 'PUT',
    path: '/news/edit/{id}',
    handler: handler.putNewsHandler,
    options: {
      auth: 'k12news_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/news/delete/{id}',
    handler: handler.deleteNewsHandler,
    options: {
      auth: 'k12news_jwt',
    },
  },
  {
    method: 'GET',
    path: '/news/image/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file'),
      },
    },
  },
];

module.exports = routes;
