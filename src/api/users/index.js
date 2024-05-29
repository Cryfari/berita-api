const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, {usersService, producersService, validator}) => {
    const usersHandler = new UsersHandler(usersService, producersService, validator);
    server.route(routes(usersHandler));
  },
};
