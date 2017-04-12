var request = require('request');
var dotenv = require('dotenv');

dotenv.load();

module.exports = function (clientId) {

  var options = { method: 'GET',
    url: 'https://lw222ii.auth0.com/api/v2/users/' + clientId,
    headers: { authorization: 'Bearer ' + process.env.AUTH0_MGMT_API_AT }, };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    var obj = JSON.parse(body);

    console.log(body);
    return body;
  });

};

/** body: (please note there may be several in identities array
 * {"email":"lars.woldern@gmail.com","email_verified":true,"name":"L W","given_name":"L","family_name":"W","picture":"https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg","locale":"sv","updated_at":"2017-04-12T10:54:14.197Z","user_id":"google-oauth2|104565667909514779590","nickname":"lars.woldern","identities":[{"provider":"google-oauth2","access_token":"ya29.GlsrBOPp6MNbiGO3rrm6PJ-d-5bkxjl2S9GowirNtWTGhRt4ZxFoBDScAbdAlSF0u6P1u6kYTAE-9P9vJib7NAUGZY3tD6m6aCgG3IZkituweWKvO2zE3G9CJZj4","expires_in":3600,"user_id":"104565667909514779590","connection":"google-oauth2","isSocial":true}],"created_at":"2017-03-07T15:26:54.028Z","last_ip":"118.163.207.40","last_login":"2017-04-12T10:54:14.197Z","logins_count":8}

 **/