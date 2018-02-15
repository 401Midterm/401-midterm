'use strict';

const Activity = require('../model/activity');
const errorHandler = require('../lib/error-handler');
const bearerAuth = require('../lib/bearer-auth');

module.exports = router => {
  router.route('/location/:location?')
    .get(bearerAuth, (request,response) => {
      if(`${request.params.location}`)
        return Activity.find({location: request.params.location, display:'true'})
          .then(activites => {
            let activitesLocations = activites.map(activity => activity.id);
            response.status(200).json(activitesLocations);
          })
          .catch(err => errorHandler(err,response));
    });
};