'use strict';

var winston = require('winston');

function APIResolve(access, result, api) {
  winston.log('info', 'api data call error for ' + api, {
    access: access,
    result: result
  })

}

function log(error, caller) {
  winston.log('info', caller, {
    error: error
  })
}


exports.APIResolve = APIResolve;
exports.log = log;