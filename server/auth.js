'use strict';
var passport = require('passport');
var dotenv = require('dotenv');

dotenv.load();

var Auth0Strategy = require('passport-auth0');
var GoogleOauthStrategy = require('passport-google-oauth').OAuth2Strategy;
var InstagramStrategy = require('passport-instagram');
var LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;
var TwitterStrategy = require('passport-twitter');
var FacebookStrategy = require('passport-facebook');

var handleLogin = require('./databaseOperations/User/handleLogin');
var userProfile;

var socialChannelCallback = function (accessToken, refreshToken, extraParams, profile, done) {
  /**
   * @accessToken används för att calla resp. API
   * @refreshToken för att förnya tokens, skickas inte av alla providers
   * @extraParams individuellt för varje provider.
   * @profile social profil
   *
   * Lagrar de credentials vi behöver i databasen från Facebook/linkedin/google osv på ett koneskvent sätt efter
   * login.
   */
  //todo google and facebook profile need to save token date so that we can count how many days we've had it for

  profile.accessToken = accessToken;
  profile.refreshToken = refreshToken;
  profile.id_token = extraParams.id_token;
  profile.extraParams = extraParams;
  profile.nickname = userProfile.nickname;
  profile.picture = userProfile.picture;
  profile.admin = userProfile._json.app_metadata.authorization.roles['0'] === 'admin';
  return done(null, profile);
};

var userLoginCallback = function (accessToken, refreshToken, extraParams, profile, done) {
  /**
   * @accessToken inehåller token för auth0 login. Används inte.
   * @refreshToken för att begära uppdaterat token. Används ite
   * @extraParams ni kan specificera övrig info att skicka med userprofiles i auth0s ui. Används inte
   * @profile inehåller mail, användarnamn mm. Finns även boolean för admin role
   * @done callback
   * Profilen som är returneras används sedan av session för att läsa av iaf inloggad användare är
   * admin eller ej.
   * Det profile.id som används genereras av auth0, det är även det userid vi använder och lagrar unikt
   * för varje användare i vår databas som referens till användare.
   */
  profile.admin = profile._json.app_metadata.authorization.roles['0'] === 'admin';
  profile.id = profile.identities['0'].user_id;
  userProfile = profile;
  handleLogin(profile);
  return done(null, profile);
};

/**
 * Passport har över 300 strategier om ni vill lägga till fler kanaler
 * http://passportjs.org/
 * Efter att en strategi har skapats och registrerats med passport.use kan den användas med Routes.
 */

passport.use(new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
}, userLoginCallback));

passport.use(new GoogleOauthStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/google/callback'
}, socialChannelCallback));

passport.use(new InstagramStrategy({
  clientID: process.env.INSTAGRAM_CLIENT_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/instagram/callback'
}, socialChannelCallback));

passport.use(new LinkedinStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/linkedin/callback'
}, socialChannelCallback));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/twitter/callback'
}, socialChannelCallback));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/facebook/callback'
}, socialChannelCallback));

// minskar storleken på payload
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;