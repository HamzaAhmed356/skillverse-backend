import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../Models/userschema.js";
import "dotenv/config";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const fullName = profile.displayName;
        const googleId = profile.id;

        // 1. Check if user exists
        let user = await User.findOne({ email });

        if (user) {
          // OPTIONAL: If they already have an account, you might want to
          // just log them in instead of throwing an error.
          // But as per your request, we throw an error:
          return done(null, false, {
            message: "User already exists. Please login.",
          });
        }

        // 2. If not exists, create new user
        user = await User.create({
          fullName,
          email,
          googleId,
          authProvider: "google",
          role: "client",
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
