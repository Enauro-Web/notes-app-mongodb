const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {

    //Match Email's username
    const user = await User.findOne({email:email});

    if(!user){
        return done(null, false, {message: 'User not found'});
    }
    else{
        //Match Password's user
        const match = await user.matchPassword(password);
        
        if(match){
            return done(null, user);
        }
        else{
            return done(null,false,{message: 'Incorrect Password'});
        }
    }

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    await User.findById(id,(error, user) => {
        done(error, user);
    })
});