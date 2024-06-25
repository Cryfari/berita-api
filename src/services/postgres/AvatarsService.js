const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
/**
 * avatar service
 */
class AvatarsService {
  /**
   * constructor
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * menambahkan avatar
   * @param {string} filename
   * @param {string} userId
   */
  async addAvatar(filename, userId) {
    const id = `cover-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO avatars VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, filename],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Avatar gagal ditambahkan');
    }
  }

  /**
   * @param {string} userId
   */
  async getAvatar(userId) {
    const query = {
      text: 'SELECT * FROM avatars WHERE "userId" = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return null;
    }
    return result.rows[0].filename;
  }

  /**
   * @param {string} newFilename
   * @param {string} userId
   */
  async updateAvatar(newFilename, userId) {
    const query = {
      text: `UPDATE avatars
              SET filename = $1 WHERE "userId" = $2
              RETURNING id`,
      values: [newFilename, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Avatar gagal diperbarui');
    }
  }
}

module.exports = AvatarsService;
