import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxLength: 50,
  },
  email: {
    type: String,
    index: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  notices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notice",
    }
  ],
  isAdmin: Boolean,
  tokenExpiration: Number,
});

export const User = mongoose.model("User", UserSchema);
