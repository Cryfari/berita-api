/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    userId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    newsId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment: {
      type: 'TEXT',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint(
      'comments',
      'fk_comments.userId_users.id',
      'FOREIGN KEY("userId") REFERENCES users(id)',
  );
  pgm.addConstraint(
      'comments',
      'fk_comments.newsId_news.id',
      'FOREIGN KEY("newsId") REFERENCES news(id)',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
