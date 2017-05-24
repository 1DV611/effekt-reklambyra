'use strict';
var schedule = require('node-schedule');
var adjustedEpoch = require('./helpers/adjustedEpoch');
var cronJob = require('./cronJob');

// run on last day of month
// call all APIs with all user access objects
// aaaand... done?


//todo linkedin reminder/reactivate every 60 days?

var job = schedule.scheduleJob({ date: 1, hour: 0, minute: 0, second: 5 }, function () {
  // job to be run?
  console.log('running monthly api call');
});

job.on('scheduled', function (event) {
  console.log('scheduled event fired');
});

job.on('canceled', function (event) {
  console.log('canceled event fired');
});

var jobTwo = schedule.scheduleJob({ second: 10 }, function () {
  console.log('running every 30 seconds');
  var unixTimeStamp = adjustedEpoch(500);
  cronJob(unixTimeStamp);
});

jobTwo.on('scheduled', function (event) {
  console.log('scheduled event fired every 30s');
});

jobTwo.on('canceled', function (event) {
  console.log('canceled event fired every 30s');
});