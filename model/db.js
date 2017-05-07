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

  schema.user.findOne({ id: profile.id }, function (err, matchingUser) {

    if (err) {
      console.error(err);
    }

    if (matchingUser === null) {
      var newUser = new schema.user({
        id: profile.id,
        displayName: profile.displayName,
      });

      newUser.save();
    }

    if (matchingUser) {
      console.log('user exists in db');
    }

  });
}

function handleToken(sessionUserID, profile) {

  var queryObj = {};
  queryObj[profile.provider] = profile.accessToken;

  schema.user.findOneAndUpdate({ id: sessionUserID }, queryObj, function (err, matchingUser) {

    if (err) console.error(err);

    if (matchingUser === null) console.error('no user to save token to'); // todo how to handle this?

    if (matchingUser) {
      console.log(matchingUser);
    }

  });
}

exports.connect = connect;
exports.handleLogin = handleLogin;
exports.handleToken = handleToken;
