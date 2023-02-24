const { uniqueId, update } = require("lodash");
const Post = require("../models/post");
const {google} = require("googleapis");

const auth = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
auth.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

const drive = google.drive({
    version: "v3",
    auth
});

const deleteFile = async (id) => {
    const response = await drive.files.delete({
        fileId: id
    });
}

exports.deletePost = (req, res) => {
    Post.findOneAndDelete({_id: req.post._id}, async (err, success) => {
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