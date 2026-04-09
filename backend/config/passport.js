const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          let existingUserByEmail = await User.findOne({ email: profile.emails[0].value });
          if (existingUserByEmail) {
            existingUserByEmail.googleId = profile.id;
            await existingUserByEmail.save();
            return done(null, existingUserByEmail);
          } else {
            user = await User.create({
              googleId: profile.id,
              username: profile.displayName || profile.emails[0].value.split('@')[0],
              email: profile.emails[0].value
            });
            return done(null, user);
          }
        }
      } catch (err) {
        console.error(err);
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
