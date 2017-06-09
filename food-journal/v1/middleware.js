var models = require('./models');
var utils = require('./utils');

/**
 * A simple authentication middleware for Express.
 *
 * This middleware will load users from session data, and handle all user
 * proxying for convenience.
 */
module.exports.simpleAuth = function(req, res, next) {
  if (req.session && req.session.user) {
    models.User.findOne({ username: req.session.user.username }, 'username ', function(err, user) {
      if (user) {
        utils.createUserSession(req, res, user);
      }
      next();
    });
  } else {
    next();
  }
};

