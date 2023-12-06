import mongoose from "mongoose";

const UserNoticeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notice",
    required: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
});

export const UserNotice = mongoose.model("UserNotice", UserNoticeSchema);
