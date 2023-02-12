const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 2,
    },
    profile: {
      bio: String,
      profile_picture: {
        data: Buffer,
        contentType: String,
      },
      mobile: String,
      social: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String,
        website: String,
        youtube: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
