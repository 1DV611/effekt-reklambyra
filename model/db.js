'use strict';
var mongoose = require('mongoose');
var moment = require('moment-timezone');
mongoose.Promise = global.Promise;
var schema = require('./schemas');
var db;

var User = require('./schemas/User');
var ApiAccess = require('./schemas/ApiAccess');
var Report = require('./schemas/Report');
var ApiData = require('./schemas/ApiData');

function connect(credential) {

  var options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  };

  mongoose.connect(credential, options);

  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'DB connection error:'));

  db.once('open', function () {
    console.log('Connected to MongoLab DB');
  });
}

function createReport(userProfileId, year, month) {

  function getLastDayOfMonth() {
    var lastDay = new Date(year, month + 1, 0);
    return lastDay.getDate();
  }

  var newReport = new Report({
    user: userProfileId,
    startDate: new Date(year, month, 1, 0, 0, 0, 1),
    endDate: new Date(year, month, getLastDayOfMonth(), 23, 59, 59, 999)
  });

  newReport.save();
  console.log('Report created!');
};

function handleLogin(profile) {

  // called with auth0 callback, either creates the user or sends the matching credentials onwards.
  User.findOne({ profileId: profile.id }).then(function (matchingUser) {

    if (matchingUser === null) {

      console.log('saving user');

      var newUser = new User({
        profileId: profile.id,
        displayName: profile.displayName,
        admin: profile.admin
      });

      newUser.save();

      var newApiAccess = new ApiAccess({
        user: newUser.profileId,
        authentication: {}
      });

      newApiAccess.save();

    } else {
      console.log('user exists in db');
    }

  }).catch(function (error) {

    console.error(error);

  })
}


function updateSocialChannelProfile(sessionUserID, profile) {

  //either saves or updates an access token into database when authorizing against facebook/google/etc.
  var queryObj = {
    accessToken: profile.accessToken,
    refreshToken: profile.refreshToken,
    id_token: profile.id_token,
    extraParams: profile.extraParams,
    profile: {
      _json: profile._json,
      _raw: profile._raw
    }
  };

  ApiAccess.findOneAndUpdate(
    { user: sessionUserID },
    { 'updated':  Date.now(), [profile.provider]: queryObj },
    { new: true },
    function (err, matchingApiAccess) {
      if (err) console.error(err);

      if (matchingApiAccess === null) console.error('no user to save token to'); // todo how to handle this?

      if (matchingApiAccess) {
          console.log(matchingApiAccess);

        //Test - skapar rapport 2016-02
        //createReport(matchingApiAccess.user, 2016, 1);
      }
    });
}

//Lars
function getUser(userID) {
  return new Promise(function (resolve, reject) {
    ApiAccess.findOne({ user: userID }).then(function (doc) {
      resolve(JSON.parse(doc));
    }).catch(function (error) {
      console.error(error);
      reject(error);
    });
  });
}

function getAPIAccesses() {
  return new Promise(function (resolve, reject) {
    ApiAccess.find({}).then(function (docs) {
      resolve(convertToAPIArray(docs));
    }).catch(function (error) {
      reject(error);
    });
  });
}

function saveAPI(data) {
  console.log(data);
}

function convertToAPIArray(docs) {
  var accessObjects = [];
  docs.forEach(function (doc) {
    accessObjects.push(doc._doc);
  });

  return accessObjects;
}

function getDataFor(user, month, year) {

  //todo month and year are coming directly from querystring so these should be typechecked...

  return new Promise(function (resolve, reject) {



  });
}

exports.connect = connect;
exports.handleLogin = handleLogin;
exports.updateSocialChannelProfile = updateSocialChannelProfile;
exports.getUser = getUser;
exports.getAPIAccesses = getAPIAccesses;
exports.saveAPI = saveAPI;
exports.getDataFor = getDataFor;
exports.createReport = createReport;
