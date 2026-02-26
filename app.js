import "dotenv/config"; // automatically loads .env
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import connectDB from "./Config/db.js";
import freelancerRoutes from "./Routes/freelancerRoutes.js";
import signupRoutes from "./Routes/apiRoutes.js";
import "./auth/google.js"; // google auth setup
import mongoose from "mongoose";
import userRoutes from "./Routes/userRoutes.js";
import gigRoutes from "./Routes/gigRoute.js";
import loginRoute from "./Routes/loginRoute.js";
const app = express();

// Middlewares

const corsOptions = {
  origin: "http://localhost:3000", // frontend URL
  credentials: true, // allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Database connect
connectDB();

// Routes
app.use("/", signupRoutes);
app.use("/user", userRoutes);
app.use("/gig", gigRoutes);
app.use("/api/freelancers", freelancerRoutes);
app.use("/login", loginRoute);

// Google OAuth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return next(err);

    // If user is false, it means our logic in Strategy blocked it (e.g., user exists)
    if (!user) {
      const message = encodeURIComponent(info.message || "Signup failed");
      return res.redirect(`http://localhost:3000/login?error=${message}`);
    }

    // Log the user in manually (since we are using a custom callback)
    req.logIn(user, (err) => {
      if (err) return next(err);

      // Success: Move to details page
      return res.redirect(
        `http://localhost:3000/signup/details?email=${user.email}&fullName=${encodeURIComponent(user.fullName)}`,
      );
    });
  })(req, res, next);
});

// Server listen
const PORT = process.env.PORT || 1001;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
