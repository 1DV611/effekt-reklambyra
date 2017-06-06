var mongoose = require('mongoose');
var db;
var seedDatabase = require('../helpers/seedDatabase');

mongoose.Promise = global.Promise;

function connect(credential) {
  var options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
  };

  mongoose.connect(credential, options);

  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'DB connection error:'));

  db.once('open', function () {
    console.log('Connected to MongoLab DB');
   seedDatabase.seedEntire();
  });
}

module.exports = connect;
