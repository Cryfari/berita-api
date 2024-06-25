const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users/profile',
    handler: handler.getUserProfileHandler,
    options: {
      auth: 'k12news_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/users/profile/username',
    handler: handler.putUserNameHandler,
    options: {
      auth: 'k12news_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/users/profile/email',
    handler: handler.putUserEmailHandler,
    options: {
      auth: 'k12news_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/users/{id}/role',
    handler: handler.putUserRoleHandler,
    options: {
      auth: 'k12news_jwt',
    },
  },
];

module.exports = routes;
