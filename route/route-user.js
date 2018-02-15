'use strict';

const User = require('../model/user');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const basicAuth = require('../lib/basic-auth');
const bearerAuth = require('../lib/bearer-auth');
const debug = require('debug')('server:route:user ');

module.exports = function(router) {
  //this is good code
  router.post('/signup', bodyParser, (request, response) => {
    debug(`POST /signup`);
    let pw = request.body.password;
    delete request.body.password;
    if (request.body.username === process.env.ADMIN_CODE) request.body.admin = true;

    let user = new User(request.body);

    user.generatePasswordHash(pw)
      .then(newUser => newUser.save())
      .then(userresponse => userresponse.generateToken())
      .then(token => {
        debug(`\tsuccessful signup`);
        response.status(201).json(token)
      })
      .catch(err => {
        debug(`\tfailed signup`);
        return errorHandler(err, response)
      });
  });

  //this is good code
  router.get('/signin', basicAuth, (request, response) => {
    debug(`GET /signin`);
    User.findOne({username: request.auth.username})
      .then(user => {
        debug(`\tcomparing password hash`);
        return user
          ? user.comparePasswordHash(request.auth.password)
          : Promise.reject(new Error('Authorization Failed. User not found.'));
      })
      .then(user => {
        delete request.headers.authorization;
        delete request.auth.password;
        return user;
      })
      .then(user => user.generateToken())
      .then(token => response.status(200).json(token))
      .catch(err => {
        debug(`\tfailed signin`);
        return errorHandler(err, response);
      });
  });

  //this is good code
  router.get('/users/:id?', bearerAuth, (request, response) => {
    debug(`GET /users/${request.params.id || ''}`);
    if(request.params.id){
      return User.findById(request.params.id)
        .then(user => ({
          name: user.username,
          activities: user.activities,
        }))
        .then(user => {
          debug(`\tfound single user: ${JSON.stringify(user)}`);
          response.status(200).json(user);
        })
        .catch(err => {
          debug(`\tfailed`);
          return errorHandler(err,response);
        });
    }
    User.find()
      .then(users => {
        let userIds = users.map(user => user.id);
        debug(`\tfound all users: ${userIds}`)
        response.status(200).json(userIds);
      })
      .catch(err => {
        debug(`\tfailed`);
        return errorHandler(err,response);
      });
  });

  router.put('/users/:id', bearerAuth, bodyParser, (request, response) => {
    debug(`PUT /users/${request.params.id}`)
    return User.findById(request.params.id)
      .then(user => {
        if(user._id.toString() === request.user._id.toString()) {
          user.username = request.body.username || user.username;
          user.email = request.body.email || user.email;
          return user.save();
        } else {
          throw new Error('authorization error, you are not that person');
        }
      })
      .then(user => {
        debug(`\tsuccessful update`);
        response.status(204).json(user);
      })
      .catch(err => {
        debug(`\tfailed update`);
        return errorHandler(err,response);
      });
  });
};
