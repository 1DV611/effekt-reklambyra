'use strict';
var schedule = require('node-schedule');
var adjustedEpoch = require('./helpers/adjustedEpoch');
var cronJob = require('./cronJob');

// https://www.npmjs.com/package/node-schedule
// körs den 1 varje månad 5 sekunder eftermiddnatt.
var firstOfMonth = schedule.scheduleJob({ date: 1, hour: 0, minute: 0, second: 5 }, function () {
  // adjusted Epoch gör att datumet blir 5 minuter före midnatt, därav hämtas data för föregående månad.
  // gjort på detta vis för att hantera olika antal dagar i månader på ett enkelt sätt.
  var date = adjustedEpoch(500);
  cronJob.monthly(date);
  console.log('running monthly API call on: ' + date.toString());
});

firstOfMonth.on('scheduled', function (event) {
  console.log('monthly API call ran: ', event);
});

firstOfMonth.on('canceled', function (event) {
  console.error('monthly API call canceled: ', event);
});

// körs varje dag 5 minuter till midnatt.
var daily = schedule.scheduleJob({ hour: 23, minute: 55 }, function () {
  var date = Date.now();
  cronJob.daily(date);
  console.log('running daily API call on: ' + date.toString());
});

daily.on('scheduled', function (event) {
  console.log('daily API call ran: ', event);
});

daily.on('canceled', function (event) {
  console.error('daily API call canceled: ', event);
});


// Du kan utkommentera detta för att köra ett test jobb med ett 30 sekunders intervall.

var testJob = schedule.scheduleJob({ second: 10 }, function () {

  // för att testa jobbet som körs i slutet på varje månad utkommentera detta
  var date = adjustedEpoch(500);
  cronJob.monthly(date);
  console.log('running 10s API call on: ' + date.toString());

  // för att testa dagliga kör detta:
  // var date = Date.now();
  // cronJob.daily(date);
  // console.log('running daily API call on: ' + date.toString());


  // eller båda

});

testJob.on('scheduled', function (event) {
  console.log('scheduled event fired every 30s', event);
});

testJob.on('canceled', function (event) {
  console.log('canceled event fired every 30s', event);
});