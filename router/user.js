const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");
//signup
router.route("/signup")         //router.route perform chaining of routes.
    .get(userController.signUpForm)
    .post((userController.signUp));
//login
router.route("/login")          
    .get(userController.loginForm)
    .post(saveRedirectUrl ,
         passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    wrapAsync(userController.login));
//logout
router.get("/logout",userController.logout);

module.exports = router;