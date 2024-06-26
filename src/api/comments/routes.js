const routes = (handler) => ([
  {
    method: 'POST',
    path: '/news/{newsId}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'k12news_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/news/{newsId}/comments/{commentId}',
    handler: handler.deleteCommentHandler,
    options: {
      auth: 'k12news_jwt',
    },
  },
  {
    method: 'GET',
    path: '/comments/all',
    handler: handler.getAllCommentsHandler,
    options: {
      auth: 'k12news_jwt',
    },
  },
]);

module.exports = routes;
