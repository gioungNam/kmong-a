import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
  {
    title: { //제목
      type: String,
      required: true,
      maxlength: 100,
    },
    content: { //내용
      type: String,
      required: true,
    },
    isPinned: {  //즐겨찾기 여부
      type: Boolean,
      default: false,
    },
    subject: { // 공지가 추가된 과목
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  },
  // { timestamps: true }
);

export const Notice = mongoose.model("Notice", NoticeSchema);
