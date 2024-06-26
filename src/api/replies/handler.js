const autoBind = require('auto-bind');
/**
 * replies handler
 */
class RepliesHandler {
  /**
   * 
   * @param {service} usersService 
   * @param {service} newsService 
   * @param {service} commentService 
   * @param {service} repliesService 
   * @param {service} validator 
   */
  constructor(usersService, newsService, commentService, repliesService, validator) {
    this._usersService = usersService;
    this._newsService = newsService;
    this._commentService = commentService;
    this._repliesService = repliesService;
    this._validator = validator;

    autoBind(this);
  }

  /**
   * @param {object} request
   * @param {object} h
   */
  async postRepliesHandler(request, h) {
    const {newsId, commentId} = request.params;
    const {id: credentialId} = request.auth.credentials;
    await this._newsService.verifyNewsId(newsId);
    await this._commentService.verifyComment(commentId);
    const data = await this._repliesService.addReply(request.payload, commentId, credentialId);
    const username = await this._usersService.getUsername(data.userId);
    delete data['userId'];
    data.username = username;
    const response = h.response({
      status: 'success',
      data: data,
    });
    response.code(201);
    return response;
  }
  /**
   * @param {object} request
   */
  async deleteRepliesHandler(request) {
    const {newsId, commentId, replyId} = request.params;
    const {id: credentialId} = request.auth.credentials;
    await this._newsService.verifyNewsId(newsId);
    await this._commentService.verifyComment(commentId);
    await this._repliesService.verifyReplies(replyId);
    const isAdmin = await this._usersService.isAdmin(credentialId);
    if (!isAdmin) {
      await this._repliesService.verifyOwnerReplies(replyId, credentialId);
    }
    await this._repliesService.deleteReply(replyId, commentId);
    return {
      status: 'success',
    };
  }

  /**
   * @param {object} request
   * @param {object} h
   */
  async getAllRepliesHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    await this._usersService.verifyAdmin(credentialId);
    const data = await this._repliesService.getAllReplies();
    const response = h.response({
      status: 'success',
      data: data,
    });
    return response;
  }
}

module.exports = RepliesHandler;
