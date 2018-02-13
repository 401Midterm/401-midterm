'use strict';
const errorHandler = require('./error-handler');
// const User = require('../model/user');
// const jsonWebToken = require('jsonwebtoken');

const ERROR_MESSAGE = 'Authorization Failed';

module.exports = function(request, response, next) {
  console.log('request.user.admin',request.user.admin);
  if(request.user.admin !== true) {
    return errorHandler(new Error(ERROR_MESSAGE), response);
  }
  next();
};