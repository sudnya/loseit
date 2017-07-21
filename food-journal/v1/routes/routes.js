module.exports = function(app, passport) {
var moment = require('moment');
var _ = require('underscore');

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

        // =============================================================================
        // ENTER MEAL TO DB
        // =============================================================================

        var configDB = require('../config/database.js');

        var mongoose = require('mongoose');
        mongoose.connect(configDB.url) // connect to our database
        var Meal       = require('../models/meal');

        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
          // we're connected!
        });

        app.post('/meals', (request, response) => {
            db.collection('meals').save(request.body, (err, result) => {
                if (err) return console.log(err)
                console.log(request)
                console.log('saved to database')
                response.redirect('/review')
            })
        });

        app.get('/review', (request, response) => {
            console.log(request.user.facebook['id'])
            if (request.user.facebook['id']) {
                uname = request.user.facebook['id'];
            }

            console.log(uname);
            db.collection('meals').find({'username': uname}).toArray((err, result) => {
            var formatDate = function(date) { return moment(date).format("MM/DD/YYYY"); }
            for(var i = 0; i < result.length; ++i) {
                result[i].date = formatDate(result[i].date);
            }
            var groupedMeals = _.groupBy(result, function(meal){ return meal.date; })
            var sortedMealKeys = [];

            for(key in groupedMeals) {
                sortedMealKeys.push(key);
            }

            sortedMealKeys = sortedMealKeys.sort().reverse();

            for (index in sortedMealKeys) {
                var key = sortedMealKeys[index];
                console.log(Object.prototype.toString.call(key) + " " + key + " = " + String(groupedMeals[key]));
            }
            if (err) return console.log(err)
            // renders index.ejs
                response.render('review.ejs', {groupedMeals: groupedMeals, sortedMealKeys : sortedMealKeys, moment: moment})
            })
        })
     // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook'));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
