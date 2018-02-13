'use strict';

const Activity = require('../model/activity');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuth = require('../lib/bearer-auth');
const ERROR_MESSAGE = 'Authorization Failed';
const User = require('../model/user');

module.exports = router => {
  router.route('/activity/:id?')
    //this is good code
    .post(bearerAuth,bodyParser,(request,response) => {
      Activity.find({name: request.body.name, location:request.body.location})
        .then(res => {
          if(res.length === 0) {
            request.body.userId = request.user._id;
            return new Activity(request.body).save()
              .then(newLibrary => response.status(201).json(newLibrary))
              .catch(err => errorHandler(err,response));
          } 
        }).catch(err => errorHandler(err,response));
    })
    
    //this is good code
    .get(bearerAuth,(request,response) => {
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

    // update a whole activiy THIS IS FOR ADMIN
    // .put(bearerAuth, bodyParser, (request,response) => {
    //   Activity.findById(request.params.id,request.body)
    //     .then(activity => {
    //       activity.name = request.body.name || activity.name;
    //       activity.location = request.body.location || activity.location;
    //       return activity.save();
    //       // if (request.body.name === undefined || request.body.location === undefined ) {
    //       //   throw new Error('validation');
    //       // }
    //       // return new Error('validation');
    //     })
    //     .then(() => response.sendStatus(204))
    //     .catch(error => errorHandler(error,response));
    // })

    //this is good code
    //lets us add a user to an activity
    .put(bearerAuth, bodyParser, (request,response) => {
      if (request.body.score === undefined) {
        throw new Error('validation');
      }
      Activity.findById(request.params.id)
        .then(activity => {
          activity.users.push(request.user._id);
          const leaderBoardItem = {
            id: request.user._id,
            score: request.body.score,
          };
          console.log(activity.leaderBoard);
          if (activity.leaderBoard.length < 3) {
            activity.leaderBoard.push(leaderBoardItem);
          } else if (activity.leaderBoard[2].score < request.body.score && activity.leaderBoard[1] >= request.body.score) {
            activity.leaderBoard[2] = leaderBoardItem;
          } else if (activity.leaderBoard[1].score < request.body.score && activity.leaderBoard[0] >= request.body.score) {
            activity.leaderBoard[2] = activity.leaderBoard[1];
            activity.leaderBoard[1] = leaderBoardItem;
          } else if (activity.leaderBoard[0].score < request.body.score) {
            activity.leaderBoard.unshift(leaderBoardItem);
          }
          return activity.save();
        })
        .then(User.findById(request.user._id)
          .then(user => {
            console.log(request.params.id);
            user.activities.push(({
              id: request.params.id,
              score: request.body.score,
            }));
            return user.save();
          }))
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    })
  
    

    .delete(bearerAuth,(request,response) => {
      return Activity.findById(request.params.id)
        .then(activity => {
          if(activity.userId.toString() === request.user.id.toString())
            return activity.remove();
          return errorHandler(new Error(ERROR_MESSAGE),response);
        })
        .then(() => response.sendStatus(204))
        .catch(err => errorHandler(err,response));
    });

  //this is good code
  //new route for leadboard
  router.route('/activity/:id/leaderboard')
    .get(bearerAuth,(request,response) => {
      console.log(request.params);
      return Activity.findById(request.params.id)
        .then(activity => activity.leaderBoard)
        .then(leaderboard => response.status(200).json(leaderboard))
        .catch(err => errorHandler(err,response));
    });
};