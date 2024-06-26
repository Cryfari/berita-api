const autoBind = require('auto-bind');

/**
 * Uploads Handler
 */
class UploadsHandler {
  /**
   * @param {service} storageService
   * @param {service} avatarsService
   * @param {validator} validator
   */
  constructor(storageService, avatarsService, validator) {
    this._storageService = storageService;
    this._avatarsService = avatarsService;
    this._validator = validator;

    autoBind(this);
  }

  /**
   * Upload Image Handler
   * @param {Object} request
   * @param {Object} h
   */
  async postUploadImageUserHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {image} = request.payload;
    this._validator.validateImageHeaders(image.hapi.headers);
    console.log(__dirname);

    const avatarIsExist = await this._avatarsService.getAvatar(credentialId);

    const filename = +new Date() + image.hapi.filename;

    if (avatarIsExist) {
      await this._storageService.deleteFile(avatarIsExist);
      await this._avatarsService.updateAvatar(
          filename, credentialId,
      );
    } else {
      await this._avatarsService.addAvatar(filename, credentialId);
      console.log('addAvatar');
    }

    await this._storageService.writeFile(image, filename);

    const response = h.response({
      status: 'success',
      message: 'Gambar berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
