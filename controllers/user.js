const User = require("../models/user");
const formidable = require('formidable');
const fs = require("fs");
const {google} = require("googleapis");

const auth = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
auth.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

const drive = google.drive({
    version: "v3",
    auth
});

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

const uploadFile = async (file) => {
    const response = await drive.files.create({
        requestBody: {
            name: file.originalFilename,
            mimeType: file.mimeType,
            parents: [process.env.PROFILE_PICTURE_FOLDER_ID]
        },
        media: {
            mimetype: file.mimetype,
            body: fs.createReadStream(file.filepath)
        }
    });
    var result = await drive.files.get({
        fileId: response.data.id
    });
    return {
        url: `https://drive.google.com/uc?export=view&id=${result.data.id}`,
        id: result.data.id
    }
}


const deleteFile = async (id) => {
    const response = await drive.files.delete({
        fileId: id
    });
}

exports.editProfile = (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
        if(err){
            res.json(err);
        } else{
            const {bio, mobile, facebook, instagram, twitter, linkedin, website, youtube} = fields;
            const {picture} = files;
            const user = req.profile;
            user.profile.bio = bio;
            user.profile.mobile = mobile;
            if(picture){
                if(files.picture.size > 1000000){
                    return res.json({
                        error: "Image size should be greater than 1Mb"
                    });
                } else{
                    if(user.profile.picture.id){
                        deleteFile(user.profile.picture.id);
                    }
                    const {url, id} = await uploadFile(picture)
                    user.profile.picture.url = url;
                    user.profile.picture.id = id;
                }
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