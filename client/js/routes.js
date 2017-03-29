const router = require("express").Router();

router.route("/home").get(function(request, response, next) {
  response.status(200).render("home");
});


module.exports = router;
