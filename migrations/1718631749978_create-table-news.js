/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('news', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    category: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    image: {
      type: 'TEXT',
    },
    uploader: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_public: {
      type: 'BOOLEAN',
      notNull: true,
      default: true,
    },
    views: {
      type: 'INTEGER',
      notNull: true,
      default: 0,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updatedAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint(
      'news',
      'fk_news.uploader_users.id',
      'FOREIGN KEY(uploader) REFERENCES users(id)',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('news');
};
