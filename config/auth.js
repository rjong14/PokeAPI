module.exports = {

    'facebookAuth' : {
        clientID      : '257578534580231', // your App ID
        clientSecret  : '2bf736b0a67a0702d99e7b52308233a3', // your App Secret
        callbackURL   : 'https://pokeapi9001.herokuapp.com/auth/facebook/callback',
        profileFields : ['id', 'email', 'name'],
        scope         : ['email']
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};