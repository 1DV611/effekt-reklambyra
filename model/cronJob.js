'use strict';
var APIs = require('./callAPIs');
var db = require('./db');

// get all the users
// use a helper function to get the right stuff from each
// call the db for each user
// PROFIT

module.exports = function () {

  db.getAllUsers().then(function (users) {
    console.log(users);
    users.forEach(function (user) {
      updateEach(user);
    });
  }).catch(function (error) {
    console.error(error);
  });

  var updateEach = function (user) {

    APIs.callAPIsFor(user).then(function (apiData) {
      db.saveAPI(apiData);
    });

  };


};