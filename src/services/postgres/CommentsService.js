const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require(
    '../../exceptions/AuthorizationError',
);
/**
 * comment Service
 */
class CommentsService {
  /**
   * constructor
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * function for add new comment
   * @param {object} payload
   * @param {string} newsId
   * @param {string} userId
   */
  async addComment(payload, newsId, userId) {
    const {content} = payload;
    const id = `comment-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO comments VALUES($1, $2, $3, $4)
              RETURNING id, "userId", comment `,
      values: [id, userId, newsId, content],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  /**
   * @param {string} newsId
   * @param {string} commentId
   */
  async deleteComment(newsId, commentId) {
    const query = {
      text: `DELETE FROM comments
              WHERE id = $1 AND "newsId" = $2`,
      values: [commentId, newsId],
    };
    await this._pool.query(query);
  }

  /**
   * @param {string} id
   */
  async verifyComment(id) {
    const query = {
      text: 'SELECT * from comments WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }

  /**
   * @param {string} commentId
   * @param {string} owner
   */
  async verifyOwnerComment(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND "userId" = $2',
      values: [commentId, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Bukan pemilik komentar');
    }
  }

  async getAllCommentsOfNews(newsId) {
    const query = {
      text: `SELECT comments.id, 
                comments.comment,
                comments."createdAt",
                users.username
                FROM comments INNER JOIN users
                ON comments."userId" = users.id AND comments."newsId" = $1
                ORDER BY comments."createdAt" DESC`,
      values: [newsId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  /**
   * get all comments
   */
  async getAllComments() {
    const query = {
      text: `SELECT comments.*, users.username
              FROM comments INNER JOIN users
              ON comments."userId" = users.id`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentsService;
