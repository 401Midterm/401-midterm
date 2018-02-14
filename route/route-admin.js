'use strict';

const Activity = require('../model/activity');
const errorHandler = require('../lib/error-handler');
const bearerAuth = require('../lib/bearer-auth');
const adminAuth = require('../lib/admin-auth');


module.exports = router => {
  router.route('/admin')
    .get(bearerAuth, adminAuth, (request,response) => {
      return Activity.find({display: 'false'})
        .then(activites => {
          let activitesIds = activites.map(activity => activity.id);
          response.status(200).json(activitesIds);
        })
        .catch(err => errorHandler(err,response));
    });
};