const User = require("../models/user");

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