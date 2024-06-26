require('dotenv').config();
const config = require('./utils/config');
const path = require('path');

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const ClientError = require('./exceptions/ClientError');
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
const authentications = require('./api/authentications');
const AuthenticationsService = require(
    './services/postgres/AuthenticationsService',
);

const news = require('./api/news');
const NewsService = require('./services/postgres/NewsService');
const NewsValidator = require('./validator/news');

const comments = require('./api/comments');
const CommentsService = require('./services/postgres/CommentsService');
const CommentsValidator = require('./validator/comments');

const replies = require('./api/replies');
const RepliesService = require('./services/postgres/RepliesService');
const RepliesValidator = require('./validator/replies');

const uploads = require('./api/uploads');
const AvatarsService = require('./services/postgres/AvatarsService');
const UploadsValidator = require('./validator/uploads');

const StorageService = require('./services/storage/StorageService');
const CoversService = require('./services/postgres/CoversService');

const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');


const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const newsService = new NewsService();
  const storageService = new StorageService(
      path.resolve(__dirname, 'api/news/file'),
  );
  const storageAvatarService = new StorageService(
      path.resolve(__dirname, 'api/uploads/file/avatar'),
  );
  const coversService = new CoversService();
  const commentService = new CommentsService();
  const repliesService = new RepliesService();
  const avatarsService = new AvatarsService();

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.nodeEnv.trim() === 'test' ?
          config.app.hostTest : config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('k12news_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
  await server.register(require('@hapi/vision'));
  await server.register([
    {
      plugin: users,
      options: {
        usersService,
        avatarsService: avatarsService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: news,
      options: {
        newsService: newsService,
        usersService: usersService,
        coversService: coversService,
        storageService: storageService,
        commentService: commentService,
        repliesService: repliesService,
        validator: NewsValidator,
      },
    },
    {
      plugin: comments,
      options: {
        newsService: newsService,
        usersService: usersService,
        commentService: commentService,
        validator: CommentsValidator,
      },
    },
    {
      plugin: replies,
      options: {
        newsService: newsService,
        usersService: usersService,
        commentService: commentService,
        repliesService: repliesService,
        validator: RepliesValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        storageService: storageAvatarService,
        avatarsService: avatarsService,
        validator: UploadsValidator,
      },
    },
  ]);

  server.views({
    engines: {
      html: require('handlebars'),
    },
    relativeTo: __dirname,
    path: 'views',
  });

  server.ext('onPreResponse', (request, h) => {
    const {response} = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }
      console.log(response);
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  server.table().forEach((route) => console.log(`${route.method}\t${route.path}`));
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
