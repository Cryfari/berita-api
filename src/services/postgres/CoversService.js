const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
/**
 * cover service
 */
class CoversService {
  /**
   * constructor
   * @param {service} storageService
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {string} filename
   * @param {string} id
   */
  async updateCoverNews(filename, id) {
    const query = {
      text: `UPDATE news
              SET image = $2
              WHERE id = $1
              RETURNING id, title`,
      values: [id, filename],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Cover gagal ditambahkan');
    }
  }

  /**
   * @param {string} filename
   * @param {string} userId
   */
  async updateCoverProfile(filename, userId) {
    const query = {
      text: `UPDATE users
              SET image = $2 WHERE id = $3
              RETURNING id`,
      values: [newFilename, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Profile gagal diperbarui');
    }
  }

  async getCoverNews(id) {
    const query = {
      text: `SELECT * FROM news WHERE id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return null;
    }
    return result.rows[0].image;
  }
}

module.exports = CoversService;
