const User = require("../models/user");
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
var { expressjwt: expressjwt } = require("express-jwt");

exports.register = (req, res) => {
    try {
        const {name, email, password} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({
                error: errors.array()[0].msg
            });
        } else{
            User.findOne({email}, (err, user) => {
                if(err){
                    res.json({
                        error: "Unknown error. Please try after some time"
                    });
                } else{
                    if(user){
                        res.json({
                            error: "A user with this email address is already registered"
                        });
                    } else{
                        const encryptedPassword = crypto.createHmac('sha256', process.env.SECRETFORPASSWORDENCRYPTION).update(password).digest('hex');
                        const newUser = new User({
                            name: name,
                            email: email,
                            password: encryptedPassword
                        });
                        newUser.save((err, user) => {
                            if(err){
                                res.json({
                                    error: "Not able to register user. Please try after some time"
                                });
                            } else{
                                res.json(user);
                            }
                        });
                    }
                }
            });
        }
    } catch (error) {
        res.json({
            error: error.message
        });
    }
}

exports.login = (req, res) => {
    try {
        const {email, password} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({
                error: errors.array()[0].msg
            });
        } else{
            User.findOne({email}, (err, user) => {
                if(err){
                    res.json({
                        error: "Unknown error. Please try after some time"
                    });
                } else{
                    if(!user){
                        res.json({
                            error: "No user registered with this email address"
                        });
                    } else{
                        const encryptedPassword = crypto.createHmac('sha256', process.env.SECRETFORPASSWORDENCRYPTION).update(password).digest('hex');
                        if(user.password === encryptedPassword){
                            const token = jwt.sign({_id: user._id}, process.env.SECRETFORTOKEN);
                            res.cookie("token", token);
                            res.json({user, token});
                        } else{
                            res.json({
                                error: "Wrong Password"
                            })
                        }
                    }
                }
            });
        }
    } catch (error) {
        res.json({
            error: error.message
        });
    }
}

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "Logout Successfully"
    })
}

exports.isSignedIn = expressjwt({secret: process.env.SECRETFORTOKEN, algorithms: ["HS256"], userProperty: "auth"});

exports.isAuthenticated = (req, res, next) => {
    const checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        res.json({
            error: "You are not allowed to perform this action"
        });
    } else{
       next();
    }
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 1){
        next();
    } else{
        res.json({
            error: "You are not admin"
        });
    }
}