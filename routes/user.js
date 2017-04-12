const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

/* GET user profile. */
router.get('/', ensureLoggedIn, function (req, res, next) {
  res.render('user', { user: req.user });
});

router.get('/mediaChannels', ensureLoggedIn, function (req, res, next) {
  res.render('mediaChannels', { user: req.user });
});

module.exports = router;
