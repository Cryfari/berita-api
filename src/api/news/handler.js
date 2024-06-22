const autoBind = require('auto-bind');

/**
 * news handler
 */
class NewsHandler {
  /**
   * constructor
   * @param {service} newsService
   * @param {service} userService
   * @param {service} validator
   */
  constructor(newsService, userService, validator) {
    this._newsService = newsService;
    this._userService = userService;
    this._validator = validator;

    autoBind(this);
  }

  /**
   * @param {request} request
   * @param {reply} h
   */
  async postAddNewsHandler(request, h) {
    const {id: uploader} = request.auth.credentials;
    await this._userService.verifyAdmin(uploader);
    await this._validator.validatePostAddNewsPayload(request.payload);
    const data = await this._newsService.addNews(request.payload, uploader);
    const response = h.response({
      status: 'success',
      message: 'Berita Berhasil ditambahkan',
      data: data,
    });
    response.code(201);
    return response;
  }
  /**
   * @param {request} request
   * @param {reply} h
   */
  async getAllNewsHandler(request, h) {
    const data = await this._newsService.getAllNews();
    const response = h.response({
      status: 'success',
      data: data,
    });
    return response;
  }
  /**
   * @param {request} request
   * @param {reply} h
   */
  async getNewsByIdHandler(request, h) {
    await this._newsService.updateViews(request.params);
    const data = await this._newsService.getNewsById(request.params);
    const response = h.response({
      status: 'success',
      data: data,
    });
    return response;
  }

  async getNewsByCategoryHandler(request, h) {
    const data = await this._newsService.getNewsByCategory(request.params);
    const response = h.response({
      status: 'success',
      data: data,
    });
    return response;
  }

  async putNewsHandler(request, h) {
    const {id: userId} = request.auth.credentials;
    await this._userService.verifyAdmin(userId);
    await this._validator.validatePutNewsPayload(request.payload);
    const {id:beritaId} = request.params;
    await this._newsService.verifyNewsId(beritaId);
    const data = await this._newsService.putNews(beritaId, request.payload);
    const response = h.response({
      status: 'success',
      message: 'Berita berhasil diupdate',
      data: data,
    });
    return response;
  }

  async deleteNewsHandler(request, h) {
    const {id: userId} = request.auth.credentials;
    await this._userService.verifyAdmin(userId);
    const {id: beritaId} = request.params;
    await this._newsService.verifyNewsId(beritaId);
    await this._newsService.deleteNews(beritaId);
    const response = h.response({
      status: 'success',
      message: 'Berita berhasil dihapus',
    });
    return response;
  }
}
module.exports = NewsHandler;
