const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
const authRoutes = require("./routes/auth-routes");
const meetingRoutes = require("./routes/meeting-routes");
const profileRoutes = require("./routes/profile-routes");

const app = express();

// load environment variables
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const PORT = process.env.PORT;
const dbURI = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION;
const passportSetup = require("./config/passport-setup");

// set up view engine
app.set("view engine", "ejs");

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  keys: [sessionSecret]
}))

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Use bluebird to avoid warning:
// "Mongoose: mpromise (mongoose's default promise library) is deprecated"
mongoose.Promise = require('bluebird');

// connect to mongodb using `mongoose.connect`...
var promise = mongoose.connect(dbURI, {
  useMongoClient: true,
  /* other options */
});

// use middleware
app.use(express.static('public'));

// set up routes
app.use("/auth", authRoutes);
app.use("/meetings", meetingRoutes);
app.use("/profile", profileRoutes);

// create home route
app.get("/", (req, res) => {
  res.render("index", {title: "GeckoMeet - Homepage"});
});

// start the server
app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
