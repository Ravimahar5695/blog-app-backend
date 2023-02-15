const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        data: Buffer,
        contentType: String
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    date: String,
    comments: {
        type: Array,
        default: []
    }
}, {timestamps: true});

module.exports = mongoose.model("Post", postSchema);