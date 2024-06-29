const autoBind = require('auto-bind');

/**
 * users handler
 */
class UsersHandler {
  /**
   * constructor
   * @param {service} usersService
   * @param {service} avatarsService
   * @param {validator} validator
   */
  constructor(usersService, avatarsService, validator) {
    this._usersService = usersService;
    this._avatarsService = avatarsService;
    this._validator = validator;
    autoBind(this);
  }

  /**
   * @param {request} request
   * @param {reply} h
   */
  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    this._usersService.verifyAvaliableUsername(request.payload.username);
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
  /**
   * @param {request} request
   * @param {reply} h
   */
  async getUserProfileHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    await this._usersService.verifyUser(credentialId);
    const data = await this._usersService.getProfileUser(credentialId);
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
  async putUserNameHandler(request, h) {
    await this._validator.validateNewUserNamePayload(request.payload);
    const {id: credentialId} = request.auth.credentials;
    const {newUsername} = request.payload;
    await this._usersService.verifyUser(credentialId);
    await this._usersService.editUsername(credentialId, newUsername);
    const response = h.response({
      status: 'success',
    });
    return response;
  }

  /**
   * @param {request} request
   * @param {reply} h
   */
  async putUserEmailHandler(request, h) {
    await this._validator.validateNewUserEmailPayload(request.payload);
    const {id: credentialId} = request.auth.credentials;
    const {newEmail} = request.payload;
    await this._usersService.verifyUser(credentialId);
    await this._usersService.editEmail(credentialId, newEmail);
    const response = h.response({
      status: 'success',
    });
    return response;
  }
  /**
   * @param {request} request
   * @param {reply} h
   */
  async putUserRoleHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    await this._usersService.verifySuperAdmin(credentialId);
    const {id: userId} = request.params;
    await this._validator.validateNewUserRolePayload(request.payload);
    const {newRole} = request.payload;
    await this._usersService.editRoleUser(userId, newRole);
    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = UsersHandler;
