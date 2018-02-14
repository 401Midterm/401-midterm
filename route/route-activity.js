
'use strict';

const Activity = require('../model/activity');
const User = require('../model/user');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuth = require('../lib/bearer-auth');
const adminAuth = require('../lib/admin-auth');


module.exports = router => {
  router.route('/activity/:id?')
  //good code and working on both.
    .post(bearerAuth,bodyParser,(request,response) => {
      if(request.params.id) {
        return Activity.findById(request.params.id)
          .then(activity => {
            if (request.body.score === undefined) {
              throw new Error('validation');
            }
            activity.users.push(request.user._id);
            const leaderBoardItem = {
              id: request.user._id,
              score: request.body.score,
            };
            activity.leaderBoard.push(leaderBoardItem);
            activity.leaderBoard.sort(function(a, b){
              return b.score - a.score;
            });
            if (activity.leaderBoard.length > 3) {
              activity.leaderBoard.length = 3;
            } 
            return activity.save();
          })
          .then(User.findById(request.user._id)
            .then(user => {
              user.activities.push(({
                id: request.params.id,
                score: request.body.score,
              }));
              return user.save();
            }))
          .then(() => response.sendStatus(201))
          .catch(error => errorHandler(error,response));
      }
      Activity.find({name: request.body.name, location:request.body.location})
        .then(res => {
          if(res.length === 0) {
            request.body.userId = request.user._id;
            return new Activity(request.body).save()            
              .then(newActivity => response.status(201).json(newActivity))
              .catch(err => errorHandler(err,response));
          } else {
            throw new Error('already made');
          }
        }).catch(err => errorHandler(err,response));
    })
    
    //this is good code
    .get(bearerAuth,(request,response) => {
      if(request.params.id){
        return Activity.find({_id: request.params.id, display: 'true'})
          .then(activity => response.status(200).json(activity))
          .catch(err => errorHandler(err,response));
      }
      return Activity.find({display: 'true'})
        .then(activites => {
          let activitesIds = activites.map(activity => activity.id);
          response.status(200).json(activitesIds);
        })
        .catch(err => errorHandler(err,response));
    })

    // working code and only for ADMIN
    .put(bearerAuth, bodyParser, adminAuth, (request,response) => {
      Activity.findById(request.params.id)
        .then(activity => {
          activity.name = request.body.name || activity.name;
          activity.location = request.body.location || activity.location;
          activity.display = request.body.display || false;
          return activity.save();
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    })

    
    //works and only for admin
    .delete(bearerAuth, adminAuth, (request,response) => {
      return Activity.findById(request.params.id)
        .then(activity => {
          return activity.remove();
        })
        .then(() => response.sendStatus(204))
        .catch(err => errorHandler(err,response));
    });

  //this is good code
  //new route for leadboard
  router.route('/activity/:id/leaderboard')
    .get(bearerAuth,(request,response) => {
      return Activity.find({_id: request.params.id, display: 'true'})
        .then(activity => {
          console.log('$$$$$$$$$$$',activity);
          // if(activity.length === 0) {
          //   throw new Error('objectid failed');
          // } //will come back to this. not sure if we need it
          return activity[0].leaderBoard;
        })
        .then(leaderboard => response.status(200).json(leaderboard))
        .catch(err => errorHandler(err,response));
    });
};