'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = require('./schemas');
var db;

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
  schema.user.findOne({ id: profile.id }).then(function (matchingUser) {

    if (matchingUser === null) {
      console.log('saving user');
      var newUser = new schema.user({
        id: profile.id,
        displayName: profile.displayName,
      });

      newUser.save();

    } else {
      console.log('user exists in db');

    }

  }).catch(function (error) {

    console.error(error)

  })
}

function handleProfile(sessionUserID, profile) {

  //either saves or updates an access token into database when authorizing against facebook/google/etc.
  var queryObj = {};
  queryObj[profile.provider] = profile;

  schema.user.findOneAndUpdate({ id: sessionUserID }, queryObj, function (err, matchingUser) {

    if (err) console.error(err);

    if (matchingUser === null) console.error('no user to save token to'); // todo how to handle this?

    if (matchingUser) {
      console.log(matchingUser);
    }

  });
}

function getUser(userID) {
  return new Promise(function (resolve, reject) {
    schema.user.findOne({ id: userID }).then(function (doc) {
      resolve(JSON.parse(doc));
    }).catch(function (error) {
      console.error(error);
      reject(error);
    });
  });
}

function getAllUsers() {
  return new Promise(function (resolve, reject) {
    schema.user.find({}).then(function (docs) {
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

exports.connect = connect;
exports.handleLogin = handleLogin;
exports.updateSocialChannelProfile = handleProfile;
exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.saveAPI = saveAPI;
