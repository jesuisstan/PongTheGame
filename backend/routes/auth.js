const router = require("express").Router();
const passport = require("passport");
const chalk = require("chalk")
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FortyTwoStrategy = require('passport-42').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

const CLIENT_URL = "http://localhost:3000";

const GOOGLE_CLIENT_ID = "629983254497-5jcucfp16tu0h1mf4u1aujru405r0aar.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const GITHUB_CLIENT_ID = 'Iv1.c6cd5263a16bf59e'
const GITHUB_CLIENT_SECRET = '4c9259000ad1a3b881af15a22fe1b30f1a990199'

const FORTYTWO_APP_ID = "u-s4t2ud-39358912695527bd1ded4f14daa81ba7793dacbd58691bc361d98f2e2b043917";
const FORTYTWO_APP_SECRET = "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";

let  user = {};
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(chalk.blue(JSON.stringify(profile)))
      user = {...profile}
      return cb(null, profile)
    }));

passport.use(new FortyTwoStrategy({
      clientID: FORTYTWO_APP_ID,
      clientSecret: FORTYTWO_APP_SECRET,
      callbackURL: "http://localhost:5000/auth/42/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(chalk.blue(JSON.stringify(profile)))
      user = {...profile}
      return cb(null, profile)
    })
);

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/github/callback",
  },
  function (accessToken, refreshToken, profile, cb) {
    console.log(chalk.blue(JSON.stringify(profile)))
    user = {...profile}
    return cb(null, profile)
  }));

router.get("/auth/getuser", (req, res) => {
  console.log("getting user data...");
  res.send(user);
});

router.get("/auth/logout", (req, res) => {
  req.logout();
  user = null
  res.redirect(`${CLIENT_URL}/login`);
  console.log("after logout")
  console.log(user)
});

router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect(`${CLIENT_URL}/profile`);
  });

router.get('/auth/42',
  passport.authenticate('42'));

router.get('/auth/42/callback',
  passport.authenticate('42', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect(`${CLIENT_URL}/profile`);
  });

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect(`${CLIENT_URL}/profile`);
  });

module.exports = router