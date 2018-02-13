'use strict';

const Activity = require('../model/activity');
const User = require('../model/user');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth');
const ERROR_MESSAGE = 'Authorization Failed';

module.exports = router => {
  router.route('/activity/:id?')
    // .post(bearerAuthMiddleware,bodyParser,(request,response) => {
    //   console.log(Activity.find({name: request.body.name, location:request.body.location}));
    //   if (Activity.find({name: request.body.name, location:request.body.location})) {
    //     errorHandler(new Error('already made'), response);
    //   }
    //   request.body.userId = request.user._id;
    //   return new Activity(request.body).save()
    //     .then(newActivity => response.status(201).json(newActivity))
    //     .catch(err => errorHandler(err,response));
    // })
    .post(bearerAuthMiddleware,bodyParser,(request,response) => {
      Activity.find(request.body.userId = request.user._id)
        .then(activity => {
          if(activity.userId === request.user._id) {
            activity.name != request.body.name || activity.name;
            activity.location != request.body.location || activity.location;
            return activity.save();
          }
          if (request.body.name === undefined || request.body.location === undefined || activity.name === request.body.name || activity.name && activity.location === request.body.location && activity.location) {
            throw new Error('validation');
          }
        })
          
        // return new Activity(request.body).save()
        .then(newActivity => response.status(201).json(newActivity))
        .catch(err => errorHandler(err,response));
    })
    
    .get(bearerAuthMiddleware,(request,response) => {
      if(request.params.id){
        return Activity.findById(request.params.id)
          .then(activity => response.status(200).json(activity))
          .catch(err => errorHandler(err,response));
      }
      return Activity.find()
        .then(activites => {
          let activitesIds = activites.map(activity => activity.id);
          response.status(200).json(activitesIds);
        })
        .catch(err => errorHandler(err,response));
    })
    .put(bearerAuthMiddleware, bodyParser, (request,response) => {
      Activity.findById(request.params.id,request.body)
        .then(activity => {
          if(activity.userId === request.user._id) {
            activity.name = request.body.name || activity.name;
            activity.location = request.body.location || activity.location;
            return activity.save();
          }
          if (request.body.name === undefined || request.body.description === undefined ) {
            throw new Error('validation');
          }
          return new Error('validation');
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    })

    .delete(bearerAuthMiddleware,(request,response) => {
      return Activity.findById(request.params.id)
        .then(activity => {
          if(activity.userId.toString() === request.user.id.toString())
            return activity.remove();
          return errorHandler(new Error(ERROR_MESSAGE),response);
        })
        .then(() => response.sendStatus(204))
        .catch(err => errorHandler(err,response));
    });
};