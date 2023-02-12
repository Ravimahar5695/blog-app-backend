const User = require("../models/user");
const formidable = require('formidable');
const fs = require("fs");

exports.getUserById = (req, res, next, id) => {
    try {
        User.findOne({_id: id}, (err, user) => {
            if(err){
                res.json({
                    error: "Unknown error"
                });
            } else{
                if(!user){
                    res.json({
                        error: "No user found"
                    });
                } else{
                    req.profile = user;
                    next();
                }
            }
        });   
    } catch (error) {
        res.json({
            error: error.message
        });
    }
}

exports.getUser = (req, res) => {
    res.json(req.profile);
}

exports.getAllUsers = (req, res) => {
    try {
        User.find((err, users) => {
            if(err){
                res.json({
                    error: "Unknown error"
                });
            } else{
                if(!users){
                    res.json({
                        error: "No user found"
                    });
                } else{
                    res.json(users);
                }
            }
        });   
    } catch (error) {
        res.json({
            error: error.message
        });
    }
}

exports.editProfile = (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if(err){
            res.json(err);
        } else{
            const {bio, mobile, facebook, instagram, twitter, linkedin, website, youtube} = fields;
            const {picture} = files;
            const user = req.profile;
            user.profile.bio = bio;
            user.profile.mobile = mobile;
            if(picture){
                user.profile.profile_picture.data = fs.readFileSync(picture.filepath);
                user.profile.profile_picture.contentType = picture.mimetype;
            }
            user.profile.social.facebook = facebook;
            user.profile.social.instagram = instagram;
            user.profile.social.twitter = twitter;
            user.profile.social.linkedin = linkedin;
            user.profile.social.youtube = youtube;
            user.profile.social.website = website;
            
            user.save((err, user) => {
                if(err){
                    res.json({
                        error: err
                    });
                } else{
                    res.json(user);
                }
            });
        }
    });
}

exports.getProfilePicture = (req, res, next) => {
    if(req.profile.profile.profile_picture.data){
        res.set("Content-Type", req.profile.profile.profile_picture.contentType);
        res.send(req.profile.profile.profile_picture.data);
    } else{
        next();
    }
}