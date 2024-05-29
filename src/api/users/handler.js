const autoBind = require('auto-bind');

/**
 * users handler
 */
class UsersHandler {
  /**
   * constructor
   * @param {service} usersService
   * @param {service} producersService
   * @param {validator} validator
   */
  constructor(usersService, producersService, validator) {
    this._usersService = usersService;
    this._producersService = producersService;
    this._validator = validator;
    autoBind(this);
  }

  /**
   * @param {request} request
   * @param {hapi} h
   */
  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const {id, username} = await this._usersService.addUser(request.payload);
    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        id,
        username,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
