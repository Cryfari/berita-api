const NewsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'news',
  version: '1.0.0',
  register: async (server, {
    usersService,
    newsService,
    validator,
  }) => {
    const newsHandler = new NewsHandler(
        newsService,
        usersService,
        validator,
    );

    server.route(routes(newsHandler));
  },
};
