const RepliesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'replies',
  version: '1.0.0',
  register: async (server, {
    usersService,
    newsService,
    coversService,
    storageService,
    commentService,
    repliesService,
    validator,
  }) => {
    const repliesHandler = new RepliesHandler(
        usersService, newsService, commentService, repliesService, validator,
    );

    server.route(routes(repliesHandler));
  },
};
