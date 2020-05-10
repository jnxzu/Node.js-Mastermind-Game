// Passport.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// reprezentacja „użytkownika” (Mongoose)
const User = require("../model");

passport.use(
  "local-signup",
  new LocalStrategy(function (username, password, done) {
    // find a user whose username is the same as the forms username
    // we are checking to see if the user trying to login already exists
    User.findOne({ username: username }, function (err, user) {
      // if there are any errors, return the error
      if (err) return done(err);

      // check to see if theres already a user with that username
      if (user) return done(null, false);
      else {
        // if there is no user with that username
        // create the user
        var newUser = new User();

        // set the user's local credentials
        newUser.username = username;
        newUser.password = newUser.generateHash(password); // use the generateHash function in our user model
        newUser.gamehistory = [];

        // save the user
        newUser.save(function (err) {
          if (err) throw err;
          return done(null, newUser);
        });
      }
    });
  })
);

passport.use(
  "local-login",
  new LocalStrategy(function (username, password, done) {
    // callback with username and password from our form

    // find a user whose username is the same as the forms username
    // we are checking to see if the user trying to login already exists
    User.findOne({ username: username }, function (err, user) {
      // if there are any errors, return the error before anything else
      if (err) return done(err);

      // if no user is found, return the message
      if (!user) {
        return done(null, false);
      }

      // if the user is found but the password is wrong
      if (!user.validPassword(password)) return done(null, false);

      // all is well, return successful user
      return done(null, user);
    });
  })
);

// mówi o tym jak pamiętać user-a w sesji (tutaj poprzez _id z MongoDB)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// mówi o tym jak na podstawie danych z sesji sesji odtworzyć user-a
passport.deserializeUser((id, done) => {
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      done(err);
    }
    if (user) {
      done(null, {
        id: user._id,
        username: user.username,
        password: user.password,
        gamehistory: user.gamehistory,
      });
    } else {
      done({
        msg: "Nieznany ID",
      });
    }
  });
});

module.exports = passport;
