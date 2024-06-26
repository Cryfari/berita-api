const routes = (handler) => ([
  {
    method: 'POST',
    path: '/news/{newsId}/comments/{commentId}/replies',
    handler: handler.postRepliesHandler,
    options: {
      auth: 'k12news_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/news/{newsId}/comments/{commentId}/replies/{replyId}',
    handler: handler.deleteRepliesHandler,
    options: {
      auth: 'k12news_jwt',
    },
  },
  {
    method: 'GET',
    path: '/replies/all',
    handler: handler.getAllRepliesHandler,
    options: {
      auth: 'k12news_jwt',
    },
  },
]);

module.exports = routes;
