const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

/* GET user profile. */
router.get('/', ensureLoggedIn, function (req, res, next) {
  res.render('user', { user: req.user });
});

router.get('/dashboard', ensureLoggedIn, function (req, res, next) {
  res.render('dashboard', { user: req.user });
});

router.get('/preview', ensureLoggedIn, function (req, res, next) {
  res.render('preview', { user: req.user });
});

router.get('/reports', ensureLoggedIn, function (req, res, next) {
  res.render('reports', { user: req.user });
});

router.get('/report/:id', ensureLoggedIn, function (req, res, next) {
  res.render('report', { user: req.user });
});

module.exports = router;
