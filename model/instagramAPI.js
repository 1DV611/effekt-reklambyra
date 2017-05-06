var instagram = require('instagram-node').instagram();
var dotenv = require('dotenv');

dotenv.load();

//https://www.npmjs.com/package/instagram-node
module.exports = function (token) {
  console.log(token);

  instagram.use({ access_token: token });


  instagram.user_self_liked([], function (err, medias, pagination, remaining, limit) {
    console.error(err);
    console.log(medias, pagination, remaining, limit);
  });
};
