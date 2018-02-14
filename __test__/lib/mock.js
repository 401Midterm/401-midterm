'use strict';

const User = require('../../model/user');
const faker = require('faker');
const Activity = require('../../model/activity');

const mock = module.exports = {};
mock.user = {};
mock.activity = {};

mock.user.createOne = () => {
  let resultUser = {};
  resultUser.password = faker.internet.password();

  return new User({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    admin: false,
    activities: [],
  })
    .generatePasswordHash(resultUser.password)
    .then(user => resultUser.user = user)
    .then(user => user.generateToken())
    .then(token => resultUser.token = token)
    .then(() => {
      return resultUser;
    });
};
mock.user.removeAll = () => Promise.all([User.remove()]);



mock.activity.createOne = () => {
  let resultMock = null;

  return mock.user.createOne()
    .then(createdUserMock => resultMock = createdUserMock)
    .then(() => {
      return new Activity({
        name: faker.name.firstName(),
        location: faker.name.firstName(),
        display: 'true',
      }).save();
    })
    .then(activity => {
      resultMock.activity = activity;
      return resultMock;
    });
};
mock.user.removeAll = () => Promise.all([User.remove()]);