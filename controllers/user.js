const express = require("express");
const User = require("../models/user.js");

module.exports.signUpForm = async (req, res) => {
    res.render("users/signup");
}

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to wonderlust");
            res.redirect("/listings");
        });
       
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm = async (req, res) => {
    res.render("users/login");
}

module.exports.login = async (req, res) => {
    req.flash("success", "WelcomeBack to TravelNest");
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logout = (req , res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","LoggedOut successfully!");
        res.redirect("/listings");
    });
}