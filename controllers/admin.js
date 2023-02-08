const { uniqueId, update } = require("lodash");
const Post = require("../models/post");

exports.deletePost = (req, res) => {
    Post.findOneAndDelete({_id: req.post._id}, (err, success) => {
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
                res.json({
                    message: "Post deleted successfully"
                });
            }
        }
    });
}
exports.deleteComment = (req, res) => {
    Post.findOneAndUpdate({
        _id: req.post._id, 
        "comments.uniqId": req.params.commentId
    }, {
        $pull: {
            comments: {
                uniqId: req.params.commentId
            }
        }
    }, {
        new: true
    }, (err, updatedPost) => {
        if(err){
            res.json({
                error: "Unknown error. Please try after some time"
            });
        } else{
            if(updatedPost === null){
                res.json({
                    error: "Not able to delete comment"
                });
            } else{
                res.json(updatedPost);
            }
        }
    });
}