/* eslint-disable camelcase */

exports.up = async (pgm) => {
  pgm.createType(
      'role',
      ['super_admin', 'admin', 'user'],
  );
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
    email: {
      type: 'TEXT',
      notNull: true,
      unique: true,
    },
    role: {
      type: 'role',
      notNull: true,
    },
    verification: {
      type: 'Boolean',
      notNull: true,
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
  pgm.dropType('role');
};
