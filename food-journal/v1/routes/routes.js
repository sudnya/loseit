module.exports = function(app, passport) {
var moment = require('moment');

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

    // REDIRECT TO CHATBOT ==============================
    app.get('/back-to-bot', function(req, res) {
        //req.logout();
        res.redirect('https://www.messenger.com/t/119981208576498/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        
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
            console.log(request.user.local['username'])
            db.collection('meals').find({'username': request.user.local['username']}).toArray((err, result) => {
            if (err) return console.log(err)
            // renders index.ejs
                response.render('review.ejs', {meals: result, moment: moment})
            })
        })
// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}


