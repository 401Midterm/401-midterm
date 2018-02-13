'use strict';

const mongoose = require('mongoose');
const Activity = mongoose.Schema({
  name: {type: String, required: true},
  location: {type: String, required: true},
  leaderBoard: [],
  users: [],
});
module.exports = mongoose.model('activity', Activity);