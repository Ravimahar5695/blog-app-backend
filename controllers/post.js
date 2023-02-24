const Post = require("../models/post");
const { validationResult } = require('express-validator');
const formidable = require('formidable');
const fs = require("fs");
const _ = require('lodash');
const uniqid = require('uniqid');
const {date} = require("../controllers/date");
const {google} = require("googleapis");

const auth = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
auth.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

const drive = google.drive({
    version: "v3",
    auth
});

exports.getPostById = (req, res, next, id) => {
    try {
        Post.findOne({_id: id}).populate("category").populate("user").exec((err, post) => {
            if(err){
                res.json({
                    error: "Unknown error"
                });
            } else{
                if(!post){
                    res.json({
                        error: "No post found"
                    });
                } else{
                    req.post = post;
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

exports.getPost = (req, res) => {
    res.json(req.post);
}

exports.getAllPosts = (req, res) => {
    try {
        const limit = req.params.limit;
        const pageNumber = req.params.pageNumber;
        const skip = (pageNumber - 1) * limit;
        Post.find().skip(skip).limit(limit).sort({_id: -1}).populate("user").populate("category").exec((err, posts) => {
            if(err){
                res.json({
                    error: "Unknown error"
                });
            } else{
                if(!posts){
                    res.json({
                        error: "No post found"
                    });
                } else{
                    posts.picture = null;
                    res.json(posts);
                }
            }
        });   
    } catch (error) {
        res.json({
            error: error.message
        });
    }
}

exports.getPostsByCategoryId = (req, res) => {
    try {
        Post.find({category: req.params.categoryId}, (err, posts) => {
            if(err){
                res.json({
                    error: "Unknown error"
                });
            } else{
                if(!posts){
                    res.json({
                        error: "No post found"
                    });
                } else{
                    res.json(posts);
                }
            }
        }).sort({_id: -1}).populate("category", "name");   
    } catch (error) {
        res.json({
            error: error.message
        });
    }
}

exports.getPostsByUserId = (req, res) => {
    try {
        Post.find({user: req.params.userId}, (err, posts) => {
            if(err){
                res.json({
                    error: "Unknown error"
                });
            } else{
                if(!posts){
                    res.json({
                        error: "No post found"
                    });
                } else{
                    res.json(posts);
                }
            }
        }).sort({_id: -1}).populate("category", "name");   
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
            parents: [process.env.POST_PICTURE_FOLDER_ID]
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

exports.createPost = (req, res) => {
    try {
        const form = formidable({ multiples: true });
        form.parse(req, async (err, fields, files) => {
        if (err) {
            res.json(err);
        } else{
            const {title, description, category} = fields;
            if(title && description && category){
                const newPost = new Post({
                    title: title,
                    description: description,
                    category: category,
                    user: req.profile._id,
                    date: date()
                });
                
                if(files.picture){
                    if(files.picture.size > 3000000){
                        return res.json({
                            error: "Image size should be less than 3Mb"
                        });
                    } else{
                        const {url, id} = await uploadFile(files.picture);
                        newPost.picture.url = url;
                        newPost.picture.id = id;
                    }
                }
    
                newPost.save((err, post) => {
                    if(err){
                        res.json({
                            error: "Unknown error. Please try after some time"
                        });
                    } else{
                        res.json({post});
                    }
                });
            } else{
                res.json({
                    error: "Please fill all mandatory fields"
                });
            }
        }
        });
    } catch (error) {
        res.json({
            error: error.message
        });
    }
}

const deleteFile = async (id) => {
    const response = await drive.files.delete({
        fileId: id
    });
}

exports.updatePost = (req, res) => {
    try {
        const form = formidable({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.json(err);
            } else{
                let newPost = req.post;
                newPost = _.extend(newPost, fields)
                if(files.picture){
                    if(files.picture.size > 3000000){
                        return res.json({
                            error: "File size should be less than 3MB"
                        });
                    } else{
                        await deleteFile(req.post.picture.id)
                        const {url, id} = await uploadFile(files.picture);
                        newPost.picture.url = url;
                        newPost.picture.id = id;
                    }
                }
                newPost.save((err, post) => {
                    if(err){
                        res.json({
                            error: "Unknown error. Please try after some time"
                        });
                    } else{
                        res.json({post});
                    }
                });
            }
        });
    } catch (error) {
        res.json({
            error: error.message
        });
    }
}

exports.deletePost = (req, res) => {
    Post.findOneAndDelete({_id: req.post._id, user: req.profile._id}, async (err, success) => {
        if(err){
            res.json({
                error: "Unknown error. Please try after some time"
            });
        } else{
            if(success === null){
                res.json({
                    error: "You can't delete this post"
                });
            } else{
                await deleteFile(req.post.picture.id);
                res.json({
                    message: "Post deleted successfully"
                });
            }
        }
    });
}

exports.comment = (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.json({
                error: errors.array()[0].msg
            });
        } else{
            const uniqId = uniqid();
            const {name, email, comment} = req.body;
            const newComment = {uniqId, name, email, comment, date: date()}
            Post.findOneAndUpdate({
                _id: req.post._id
            }, {
                $push: {
                    comments: newComment
                }
            }, {
                new: true
            }, (err, updatedPost) => {
                if(err){
                    res.json({
                        error: "Unknown error. Please try after some time"
                    });
                } else{
                    res.json(updatedPost.comments)
                }
            });
        }
    } catch (error) {
        res.json({
            error: error.message
        });
    }
}