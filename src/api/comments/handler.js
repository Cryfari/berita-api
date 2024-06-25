const autoBind = require('auto-bind');
const { logger } = require('handlebars');


/**
* comments handler
*/
class CommentHandler {
/**
 * 
 * @param {service} commentService
 * @param {service} newsService
 * @param {service} usersService
 * @param {service} validator
 */
  constructor(commentService, newsService, usersService, validator) {
    this._commentService = commentService;
    this._newsService = newsService;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  /**
   * @param {object} request
   * @param {object} h
   */
  async postCommentHandler(request, h) {
    await this._validator.validatePostAddCommentPayload(request.payload);

    const {newsId} = request.params;
    const {id: credentialId} = request.auth.credentials;
    await this._newsService.verifyNewsId(newsId);
    const data = await this._commentService.addComment(request.payload, newsId, credentialId);
    const username = await this._usersService.getUsername(data.userId);
    delete data['userId'];
    data.username = username;
    const response = h.response({
      status: 'success',
      messages: 'Komentar berhasil ditambahkan',
      data,
    });
    response.code(201);
    return response;
  }
  /**
   * @param {object} request
   */
  async deleteCommentHandler(request) {
    const {newsId, commentId} = request.params;
    await this._newsService.verifyNews(newsId);
    await this._commentService.verifyComment(commentId);
    const {id: credentialId} = request.auth.credentials;
    const isAdmin = this._usersService.isAdmin(credentialId);
    if (!isAdmin) {
      this._commentService.verifyOwnerComment(commentId, credentialId);
    }

    await this._commentService.deleteComment(commentId);
    return {
      status: 'success',
    };
  }

  /**
   * @param {string} newsId
   */
  async getAllCommentsOfThread(newsId) {
    const query = {
      text: `SELECT comments.id,
                comments.content,
                comments.createdAt,
                users.username
                FROM comments INNER JOIN users
                ON comments.userId = users.id AND comments.newsId = $1
                ORDER BY comments.date ASC`,
      values: [newsId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentHandler;
