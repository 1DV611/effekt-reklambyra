'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = require('./schemas');
var db;

function connect(credential) {

  var options = {
    server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
    replset: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}}
  };

  mongoose.connect(credential, options);

  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'DB connection error:'));

  db.once('open', function () {
    console.log('Connected to MongoLab DB');
  });
}

function handleLogin(profile) {

  schema.user.findOne({id: profile.id, username: profile.username}, function (err, matchingUser) {

    if (err) {
      console.error(err);
    }

    if (matchingUser === null) {
      var newUser = new schema.user({
        id: profile.id,
        username: profile.username,
        accessToken: profile.accessToken,
        _raw: profile._raw,
      });

      newUser.save();
    }

    if (matchingUser) {
      console.log('user exists in db');
    }

  });
}

exports.connect = connect;
exports.handleLogin = handleLogin;