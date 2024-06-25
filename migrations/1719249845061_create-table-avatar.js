/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('avatars', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    userId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    filename: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.addConstraint(
      'avatars',
      'unique_userId_and_filename',
      'UNIQUE("userId", filename)',
  );

  pgm.addConstraint(
      'avatars',
      'fk_avatars.userId_users.id',
      'FOREIGN KEY("userId") REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('avatars');
};
