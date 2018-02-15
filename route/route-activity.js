'use strict';

const Activity = require('../model/activity');
const User = require('../model/user');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuth = require('../lib/bearer-auth');
const adminAuth = require('../lib/admin-auth');
const debug = require('debug')('server:route:activ');


module.exports = router => {
  router.route('/activity/:id?')
  //good code and working on both.
    .post(bearerAuth,bodyParser,(request,response) => {
      debug(`POST /activity/${request.params.id || ''}`);
      if(request.params.id) {
        return Activity.findById(request.params.id)
          .then(activity => {
            debug(`\tupdating activity`);
            if (request.body.score === undefined) {
              throw new Error('validation');
            }

            if (!activity.users.toString().includes(request.user._id.toString('hex'))) {
              activity.users.push(request.user._id);
            } 

            const leaderBoardItem = {
              id: request.user._id,
              score: request.body.score,
            };

            for(let i = 0; i < activity.leaderBoard.length; i++) {
              if(activity.leaderBoard[i].id.toString() === request.user._id.toString('hex')) {
                if(parseInt(request.body.score) > parseInt(activity.leaderBoard[i].score.toString())) {
                  activity.leaderBoard[i].score = request.body.score;
                }
              }
            }

            if(activity.leaderBoard.length === 0) {
              activity.leaderBoard.push(leaderBoardItem);
            }

            for(let i = 0; i < activity.leaderBoard.length; i++) {
              if (activity.leaderBoard[i].id.toString() !== leaderBoardItem.id.toString()) {
                activity.leaderBoard.push(leaderBoardItem);
              } 
            }

            activity.leaderBoard.sort(function(a, b){
              return b.score - a.score;
            });
            if (activity.leaderBoard.length > 3) {
              activity.leaderBoard.length = 3;
            }
            debug(`\tsaving leaderboard: ${JSON.stringify(activity.leaderBoard)}`);
            return activity.save();
          })

          .then(User.findById(request.user._id)
            .then(user => {
              user.activities.push(({
                id: request.params.id,
                score: request.body.score,
              }));
              debug(`\tsaving`);
              return user.save();
            }))
          .then(() => {
            debug(`\tsuccessfully posted`);
            response.sendStatus(201);
          })
          .catch(error => {
            debug(`\tfailed post`);
            return errorHandler(error,response);
          });
        
      }
      Activity.find({name: request.body.name, location: request.body.location})
        .then(res => {
          debug(`\tcreating activity`);
          if(res.length === 0) {
            request.body.userId = request.user._id;
            debug(`\tsaving`);
            return new Activity(request.body).save()
              .then(newActivity =>
              {
                debug(`\tsuccesfully posted`);
                response.status(201).json(newActivity);
              })
              .catch(err => errorHandler(err,response));
          } else {
            throw new Error('already made');
          }
        }).catch(err => {
          debug(`\tfailed post`);
          return errorHandler(err,response);
        });
    })

    //this is good code
    .get(bearerAuth,(request,response) => {
      debug(`GET /activity/${request.params.id || ''}`);
      if(request.params.id){
        return Activity.find({_id: request.params.id, display: 'true'})
          .then(activity => {
            debug(`\tfound single activity: ${activity}`);
            return response.status(200).json(activity);
          })
          .catch(err => {
            debug(`\tfailed to find single activity: ${err}`);
            errorHandler(err,response);
          });
      }
      return Activity.find({display: 'true'})
        .then(activites => {
          let activitesIds = activites.map(activity => activity.id);
          debug(`\tfound all visible activities: ${activitesIds}`);
          response.status(200).json(activitesIds)
        })
        .catch(err => {
          debug(`\tfailed to find all`);
          return errorHandler(err,response);
        });
    })

  // working code and only for ADMIN
    .put(bearerAuth, bodyParser, adminAuth, (request,response) => {
      debug(`PUT /activity/${request.params.id || ''}`);
      Activity.findById(request.params.id)
        .then(activity => {
          activity.name = request.body.name || activity.name;
          activity.location = request.body.location || activity.location;
          activity.display = request.body.display || false;
          debug(`\tsaving`);
          return activity.save();
        })
        .then(() => {
          debug(`\tsuccessfully updated activity`);
          response.sendStatus(204);
        })
        .catch(error => {
          debug(`\tfailed`);
          return errorHandler(error,response);
        });
    })


  //works and only for admin
    .delete(bearerAuth, adminAuth, (request,response) => {
      debug(`DELETE /activity/${request.params.id || ''}`);
      return Activity.findById(request.params.id)
        .then(activity => {
          debug(`\tremoving`);
          return activity.remove();
        })
        .then(() => {
          debug(`\tsuccessfully deleted`);
          response.sendStatus(204);
        })
        .catch(err => {
          debug(`\tfailed delete`);
          return errorHandler(err,response);
        });
    });


  //this is good code
  //new route for leadboard
  router.route('/activity/:id/leaderboard')
    .get(bearerAuth,(request,response) => {
      debug(`GET /activity/${request.params.id}/leaderboard`);
      return Activity.find({_id: request.params.id, display: 'true'})
        .then(activity => {
          // if(activity.length === 0) {
          //   throw new Error('objectid failed');
          // } //will come back to this. not sure if we need it
          return activity[0].leaderBoard;
        })
        .then(leaderboard => {
          debug(`\tsuccesfully found single leaderboard: ${leaderboard}`);
          response.status(200).json(leaderboard);
        })
        .catch(err => {
          debug(`\tfailed`);
          return errorHandler(err,response);
        });
    });
};
