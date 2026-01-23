const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    //profile info in profile var
    function (accessToken, refreshToken, profile, done) {
      console.log("====== GOOGLE USER DATA ======");
      console.log("ID:", profile.id);
      console.log("Display Name:", profile.displayName);
      console.log("First Name:", profile.name?.givenName);
      console.log("Last Name:", profile.name?.familyName);
      console.log("Emails:", profile.emails);
      console.log("Photos:", profile.photos);
      console.log("Raw Profile:", JSON.stringify(profile, null, 2));
      console.log("==============================");
      return done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
