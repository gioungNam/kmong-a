import { requireAuth } from "../../user.permission.js";
import { AuthenticationError } from "apollo-server";
import { User } from "../../models/user.model.js";
import bcrypt from "bcrypt";
import { UserNotice } from "../../models/usernotice.model.js";
import { Notice } from "../../models/notice.model.js";
import mongoose from "mongoose";

export const mutCreateUser = async (
  _,
  { username, email, password },
  { user }
) => {
  requireAuth(user);
  if (!user.isAdmin) {
    throw new AuthenticationError("Unauthorized: Only admins can create users");
  }

  if (username.length < 2) {
    throw new Error("Name should be at least 2 characters long");
  }

  if (email.length < 4) {
    throw new Error("Username should be at least 4 characters long");
  }

  if (password.length < 8) {
    throw new Error("Password should be at least 8 characters long");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  return newUser.save();
};


// 즐겨찾기 추가
export const mutAddFavorite = async (_, { userId, noticeId}) => {

  try{
    const user = await User.findOne({ email: userId });

    if (user) {
      if (!user.notices?.includes(noticeId)) {
        await user.updateOne({ $addToSet: { notices: noticeId } });
      }
    
      return new UserNotice({
        user: userId,
        notice: noticeId,
        isPinned: true
      });

    } else {
      throw new Error("UserNotice not found");
    }

  } catch (error) {
    throw new Error(`Error adding favorite: ${error.message}`);
  }
  
};

// 특정 회원의 즐겨찾기 목록 조회
export const queryFavoriteNotices = async (_, {userId}) => {
  try{
    const user = await User.findOne({ email: userId });

    if (user) {
      
      const notices = await Notice.find({ _id: { $in: user.notices } })
      .populate('subject', 'name')
      .exec();

      return notices;

    } else {
      throw new Error("유효하지 않은 회원입니다.");
    }

} catch (error) {
  throw new Error(`Error select favorite: ${error.message}`);
}

};

// 즐겨찾기 취소
export const mutCancelFavorite = async (_, {userId, noticeId}) => {

  try{
    const user = await User.findOne({ email: userId });

    if (user) {

      // 인자로 들어온 id값을 뺀다.
      if (user.notices?.includes(noticeId)) {
        const objectIdNoticeId = new mongoose.Types.ObjectId(noticeId);
        user.notices = user.notices?.filter(id => !id.equals(objectIdNoticeId));
        await user.save();
      }
    
      return new UserNotice({
        user: userId,
        notice: noticeId,
        isPinned: false
      });

    } else {
      throw new Error("UserNotice not found");
    }

  } catch (error) {
    throw new Error(`Error cancel favorite: ${error.message}`);
  }

};