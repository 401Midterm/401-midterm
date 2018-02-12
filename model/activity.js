'use strict';

const mongoose = require('mongoose');
const Activity = mongoose.Schema({
  name: {type: String, required: true},
  location: {type: String, required: true},
  leaderBoard: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true}],
});
module.exports = mongoose.model('activity', Activity);