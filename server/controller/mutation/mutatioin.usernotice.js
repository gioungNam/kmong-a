import { UserNotice } from "../../models/usernotice.model.js";

export const mutUpdateUserNoticePinnedStatus = async (_, { noticeId, isPinned }, { user }) => {
  requireAuth(user);

  const userNotice = await UserNotice.findOne({ user: user._id, notice: noticeId });
  
  if (userNotice) {
    userNotice.isPinned = isPinned;
    await userNotice.save();
    return userNotice;
  } else {
    throw new Error("UserNotice not found");
  }
};
