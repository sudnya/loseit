// load up the user model
/*var Meal       = require('../app/models/meal');
module.exports = function(journal) {


        var configDB = require('../config/database.js');
                
        var mongoose = require('mongoose');
        mongoose.connect(configDB.url) // connect to our database

        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
          // we're connected!
        });
        //var Meal = mongoose.model('Meal', mealSchema);
                
        app.post('/meals', (request, response) => {
            db.collection('meals').save(request.body, (err, result) => {
                if (err) return console.log(err)
                console.log(request)
                console.log('saved to database')
                response.redirect('/profile')
            })
        });

        app.get('/profile', (request, response) => {
            db.collection('meals').find().toArray((err, result) => {
                console.log(meals)
                console.log(result)
            if (err) return console.log(err)
            // renders index.ejs
                response.render('profile.ejs', {meals: result})
            })
        })

}*/
