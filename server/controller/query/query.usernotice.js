import { UserNotice } from "../../models/usernotice.model.js";
import { Notice } from "../../models/notice.model.js";
import { requireAuth } from "../../user.permission.js";

// 특정 사용자의 모든 즐겨찾기된 공지 사항을 가져오는 함수
export const queryUserNotices = async (_, __, { user }) => {
  requireAuth(user);

  const userNotices = await UserNotice.find({ user: user._id }).populate('notice');
  return userNotices;
};

// 특정 사용자가 특정 공지를 즐겨찾기했는지 확인하는 함수
export const queryCheckUserNotice = async (_, { userId, noticeId }, { user }) => {
  requireAuth(user);

  if (user._id !== userId) {
    throw new Error("Not authorized");
  }

  const userNotice = await UserNotice.findOne({ user: userId, notice: noticeId });
  return userNotice;
};
