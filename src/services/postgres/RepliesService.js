const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require(
    '../../exceptions/AuthorizationError',
);
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
/**
 * class implementation replies repository for postgres database
 */
class RepliesService {
  /**
   * constructor
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {object} payload
   * @param {string} commentId
   * @param {string} userId
   */
  async addReply(payload, commentId, userId) {
    const {content} = payload;
    const id = `reply-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO replies VALUES($1, $2, $3, $4)
      RETURNING id, "userId", content`,
      values: [id, userId, commentId, content],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  /**
   * @param {string} repliesId
   * @param {string} commentId
   */
  async deleteReply(repliesId, commentId) {
    const query = {
      text: `DELETE FROM replies
              WHERE id = $1 AND "commentId" = $2`,
      values: [repliesId, commentId],
    };
    await this._pool.query(query);
  }

  /**
   * @param {string} commentId
   */
  async getAllRepliesOfComment(commentId) {
    const query = {
      text: `SELECT replies.id,
                  replies.content,
                replies."createdAt",
                users.username
                FROM replies INNER JOIN users
                ON replies."userId" = users.id AND replies."commentId" = $1
                ORDER BY replies."createdAt" ASC`,
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  /**
   * @param {string} repliesId
   */
  async verifyReplies(repliesId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [repliesId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }

  /**
   * @param {string} repliesId
   * @param {string} userId
   */
  async verifyOwnerReplies(repliesId, userId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND userId = $2',
      values: [repliesId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('anda bukan pemilik komentar');
    }
  }
  /**
   * get all replies
   */
  async getAllReplies() {
    const query = {
      text: `SELECT replies.*, users.username
              FROM replies INNER JOIN users
              ON replies."userId" = users.id`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = RepliesService;
