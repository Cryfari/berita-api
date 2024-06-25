const autoBind = require('auto-bind');

/**
 * news handler
 */
class NewsHandler {
  /**
   * constructor
   * @param {service} newsService
   * @param {service} userService
   * @param {service} coversService
   * @param {service} storageService
   * @param {service} validator
   */
  constructor(newsService, userService, coversService, storageService, commentService, repliesService, validator) {
    this._newsService = newsService;
    this._userService = userService;
    this._coversService = coversService;
    this._storageService = storageService;
    this._commentService = commentService;
    this._repliesService = repliesService;
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
    this._validator.validateImageHeaders(request.payload.image.hapi.headers);

    const data = await this._newsService.addNews(request.payload, uploader);

    const coverIsExist = await this._coversService.getCoverNews(data.id);
    const filename = +new Date() + request.payload.image.hapi.filename;
    if (coverIsExist) {
      await this._storageService.deleteFile(coverIsExist);
    }
    await this._coversService.updateCoverNews(filename, data.id);
    await this._storageService.writeFile(request.payload.image, filename);

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
    const {id: newsId} = request.params;
    await this._newsService.verifyNewsId(newsId);
    await this._newsService.updateViews(newsId);
    const news = await this._newsService.getNewsById(newsId);
    const comments = await this._commentService.getAllCommentsOfNews(news.id);
    for (let i = 0; i < comments.length; i++) {
      const replies = await this._repliesService
          .getAllRepliesOfComment(comments[i].id);
      comments[i].replies = replies;
    }
    news.comments = comments;
    const response = h.response({
      status: 'success',
      data: news,
    });
    return response;
  }

  /**
   * @param {request} request
   * @param {reply} h
   */
  async getNewsByCategoryHandler(request, h) {
    await this._validator.validateCategoryParams(request.params);
    const data = await this._newsService.getNewsByCategory(request.params);
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
  async putNewsHandler(request, h) {
    const {id: userId} = request.auth.credentials;
    await this._userService.verifyAdmin(userId);
    await this._validator.validatePutNewsPayload(request.payload);
    const {id: beritaId} = request.params;
    await this._newsService.verifyNewsId(beritaId);
    const data = await this._newsService.putNews(beritaId, request.payload);
    const response = h.response({
      status: 'success',
      message: 'Berita berhasil diupdate',
      data: data,
    });
    return response;
  }

  /**
   * @param {request} request
   * @param {reply} h
   */
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
