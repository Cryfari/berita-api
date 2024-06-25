const CommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'comments',
  version: '1.0.0',
  register: async (server, {
    commentService,
    newsService,
    usersService,
    validator,
  }) => {
    const commentsHandler = new CommentsHandler(
        commentService,
        newsService,
        usersService,
        validator,
    );

    server.route(routes(commentsHandler));
  },
};
