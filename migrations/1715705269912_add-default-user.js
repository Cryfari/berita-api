/* eslint-disable camelcase */
require('dotenv').config();
const {nanoid} = require('nanoid');
const bcrypt = require('bcrypt');

exports.up = async (pgm) => {
  const id = `user-${nanoid(16)}`;
  const username = process.env.USERNAME_ADMIN;
  const fullname = process.env.FULLNAME;
  const password = await bcrypt.hash('admin', 10);
  const email = process.env.EMAIL;
  const role = 'super_admin';

  pgm.sql(```INSERT INTO users (id, username, password, fullname, email, role)
              VALUES (
                '${id}', '${username}', '${password}',
                '${fullname}', '${email}', '${role}'
              )```);
};

exports.down = (pgm) => {
  pgm.sql(`DELETE FROM users WHERE password = '${process.env.USERNAME_ADMIN}'`);
};
