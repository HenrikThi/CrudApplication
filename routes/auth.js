const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const {preloadNfts} = require("../api/opensea")

// const ensureLogin = require("connect-ensure-login");

router.get("/private-page", (req, res) => {
  // router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/login", (req, res, next) => {
  preloadNfts();
  res.render("auth/login");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (username.length === 0 || password.length == 0) {
    // if yes show the form again with a message
    res.render("auth/signup", {
      message: "Your username or password cannot be empty",
    });
    return;
  }

  User.findOne({ username: username }).then((userFromDB) => {
    // if user exists
    if (userFromDB !== null) {
      // we render signup again
      res.render("auth/signup", { message: "This username is already taken" });
      return;
    } else {
      // if we reach this point this username can be used
      // we hash the password and create the user in the database
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hash })
        .then((createdUser) => {
          console.log(createdUser);
          res.redirect("/login");
          //TODO: does not work yet ;(
          // log the user in using passport
          // using basic-auth -> req.session.user
          // req.login(createdUser, (err) => {
          //   if (err) {
          //     next(err);
          //   } else {
          //     res.redirect("/");
          //   }
          // });
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/quiz",
    failureRedirect: "/login",
    passReqToCallback: true,
  })
);

router.get('/logout', (req, res, next) => {	 
	req.logout()
	res.redirect('/login')
});

const loginCheck = () => {
  return (req, res, next) => {
    // with basic-auth: req.session.user
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
  };
};

module.exports = {router, loginCheck};
