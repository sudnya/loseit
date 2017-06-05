// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var mealSchema = mongoose.Schema({
    username: String,
    mealType: String,
    item: String,
    date: Date,
    hungerLevel: Number,
    satietyLevel: Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Meal', mealSchema);
