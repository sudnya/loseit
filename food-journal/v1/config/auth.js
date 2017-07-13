// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
 'facebookAuth' : {
     'clientID'        : '318410955256174', // your App ID
     'clientSecret'    : '8eb19c399bfba9e39d9f8d864a7bc1c5', // your App Secret
     'callbackURL'     : 'https://food-journal-fb.herokuapp.com/auth/facebook/callback'
 }
};
