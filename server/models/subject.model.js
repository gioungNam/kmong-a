import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
  },
  credit: Number,
  classification: String,
  capacity: Number,
  openurl: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  ],
  //공지추가
  notices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notice",
      index: true,
    },
  ],
});

export const Subject = mongoose.model("Subject", SubjectSchema);