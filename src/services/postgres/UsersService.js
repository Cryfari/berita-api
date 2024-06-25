const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

/**
 * Service untuk menangani resource users
 */
class UsersService {
  /**
   * constructor
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {string} username
   */
  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  /**
   * @param {string} email
   */
  async verifyNewEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };
    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError('Email sudah digunakan');
    }
  }

  /**
   * @param {string} username
   * @param {string} password
   * @param {string} fullname
   */
  async addUser({username, password, fullname, email, role}) {
    await this.verifyNewUsername(username);
    await this.verifyNewEmail(email);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: `INSERT INTO users (id, username, password, fullname, email, role)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, username`,
      values: [id, username, hashedPassword, fullname, email, role],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0];
  }

  /**
   * verifikasi user credential
   * @param {string} username
   * @param {string} password
   */
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const {id, password: hashedPassword} = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }
  /**
   * @param {string} id
   */
  async verifySuperAdmin(id) {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1 AND role = $2',
      values: [id, 'super_admin'],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('Akses Ditolak');
    }
  }
  /**
   * @param {string} id
   */
  async verifyAdmin(id) {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1 AND role = $2',
      values: [id, 'user'],
    };
    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new AuthorizationError('Akses Ditolak');
    }
  }
  /**
   * @param {string} id
   */
  async verifyUser(id) {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Anda belum terdaftar');
    }
  }
  /**
   * @param {string} id
   */
  async isAdmin(id) {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1 AND role = $2',
      values: [id, 'user'],
    };
    const result = await this._pool.query(query);

    if (result.rows.length) {
      return false;
    }
    return true;
  }
  /**
   * @param {string} id
   */
  async getUsername(id) {
    const query = {
      text: 'SELECT username FROM users WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0].username;
  }

  /**
   * get list user
   */
  async getAllUser() {
    const query = {
      text: 'SELECT id, username, email, fullname, role FROM users',
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
  /**
   * @param {string} id
   * @param {string} newRole
   */
  async editRoleUser(id, newRole) {
    const query = {
      text: `UPDATE users SET role = $2
              WHERE id = $1
              RETURNING id`,
      values: [id, newRole],
    };
    await this._pool.query(query);
  }
  /**
   * @param {string} id
   * @param {string} newUsername
   */
  async editUsername(id, newUsername) {
    const query = {
      text: `UPDATE users SET username = $2
              WHERE id = $1
              RETURNING id`,
      values: [id, newUsername],
    };
    await this._pool.query(query);
  }
  /**
   * @param {string} id
   * @param {string} newEmail
   */
  async editEmail(id, newEmail) {
    const query = {
      text: `UPDATE users SET email = $2
              WHERE id = $1
              RETURNING id`,
      values: [id, newEmail],
    };
    await this._pool.query(query);
  }

  /**
   * @param {string} id
   */
  async getProfileUser(id) {
    const query = {
      text: `SELECT users.id, users.username, users.fullname,
              users.role, users.email, avatars.filename AS avatar
              FROM users 
              LEFT JOIN avatars 
              ON users.id = avatars."userId" 
              WHERE users.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = UsersService;
