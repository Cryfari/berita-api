const config = {
  app: {
    host: process.env.HOST,
    hostTest: process.env.HOST_TEST,
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
  },
  postgres: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    ssl: {
      rejectUnauthorized: false,
      ca: process.env.PGSSLCERT,
    },
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
};

module.exports = config;
