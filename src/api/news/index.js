const NewsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'news',
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
    const newsHandler = new NewsHandler(
        newsService,
        usersService,
        coversService,
        storageService,
        commentService,
        repliesService,
        validator,
    );

    server.route(routes(newsHandler));
  },
};
