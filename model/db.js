'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = require('./schemas');
var db;

var User = require('./schemas/User');
var ApiAccess = require('./schemas/ApiAccess');

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

function handleLogin(profile) {

  // called with auth0 callback, either creates the user or sends the matching credentials onwards.
  User.findOne({ profileId: profile.id }).then(function (matchingUser) {

      console.log(profile);

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

  ApiAccess.findOneAndUpdate({ user: sessionUserID }, { '$set': { 'updated':  Date.now() },  '$set': { [profile.provider]: queryObj }}, function (err, matchingUser) {

    if (err) console.error(err);

    if (matchingUser === null) console.error('no user to save token to'); // todo how to handle this?

    if (matchingUser) {
      console.log(matchingUser);
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

function getAllUsers() {
  return new Promise(function (resolve, reject) {
    User.find({}).then(function (docs) {
      resolve(convertToUsersArray(docs));
    }).catch(function (error) {
      reject(error);
    });
  });
}

function saveAPI(data) {
  console.log(data);
}

function convertToUsersArray(docs) {
  var userObjects = [];
  docs.forEach(function (doc) {
    userObjects.push(doc._doc);
  });
  return userObjects;
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
exports.getAllUsers = getAllUsers;
exports.saveAPI = saveAPI;
exports.getDataFor = getDataFor;
