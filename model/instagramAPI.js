let instagram = require('instagram-node').instagram();
let dotenv = require('dotenv');

dotenv.load();

module.exports = function (token) {
  console.log(token);

  instagram.use({ access_token: token });
  instagram.use({
    client_id: process.env.INSTAGRAM_CLIENT_ID,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
  });

  instagram.user_self_liked([], function (err, medias, pagination, remaining, limit) {
    console.error(err);
    console.log(medias, pagination, remaining, limit);
  });
};
