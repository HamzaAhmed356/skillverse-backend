const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db");
const app = express();
const freelancerRoutes = require("./Routes/freelancerRoutes");
const passport = require("passport");
const session = require("express-session");
require("./auth/google");
app.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: true,
  }),
);

// integration code
app.use(cors());
app.use(express.json());

// Database connect
connectDB();
app.use("/api/freelancers", freelancerRoutes);

app.get("/api/test", (req, res) => {
  console.log("backend connected Successfully");
  res.json({ message: "Backend connected successfully" });
});

app.use(passport.initialize());
app.use(passport.session());
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/signup",
  }),
  (req, res) => {
    // Send user back to frontend
    res.redirect("http://localhost:3000/gigs");
  },
);

const Port = 1001;
app.listen(Port, () => {
  console.log("Server running at http://localhost:1001");
});
