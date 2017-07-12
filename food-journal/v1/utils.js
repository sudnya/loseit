var bodyParser = require('body-parser');
var csrf = require('csurf');
var express = require('express');
var mongoose = require('mongoose');
var session = require('client-sessions');

var middleware = require('./middleware');

/**
 * Given a user object:
 *
 *  - Store the user object as a req.user
 *  - Make the user object available to templates as #{user}
 *  - Set a session cookie with the user object
 *
 *  @param {Object} req - The http request object.
 *  @param {Object} res - The http response object.
 *  @param {Object} user - A user object.
 */
module.exports.createUserSession = function(req, user) {
  var cleanUser = {
    username:  user.username,
  };

  req.session.user = cleanUser;
  req.user = cleanUser;
};

/**
 * Create and initialize an Express application that is 'fully loaded' and
 * ready for usage!
 *
 * This will also handle setting up all dependencies (like database
 * connections).
 *
 * @returns {Object} - An Express app object.
 */
module.exports.createApp = function() {
  mongoose.Promise = global.Promise;
  //TODO: bad idea to check in the following line :(
  mongoose.connect('mongodb://admin:Loseit2017@ds147681.mlab.com:47681/food-journal');

  var app = express();

  // settings
  app.set('view engine', 'ejs');

  // middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    cookieName: 'session',
    secret: 'keyboard cat',
    expires: new Date(Date.now() + 4294967295),
    maxAge:  4294967295,
    duration: 4294967295,
    activeDuration: 4294967295,
  }));

  var csrf = require('csurf');
  app.use(session({ secret: 'qwerty', saveUninitialized: true, resave: true}));
  app.use(csrf());

  //app.use(csrf());
  app.use(middleware.simpleAuth);

  // routes
  app.use(require('./routes/routes'));

  return app;
};

/**
 * Ensure a user is logged in before allowing them to continue their request.
 *
 * If a user isn't logged in, they'll be redirected back to the login page.
 */
module.exports.requireLogin = function(req, res, next) {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};
