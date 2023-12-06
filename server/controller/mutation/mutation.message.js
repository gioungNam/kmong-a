import { User } from "../../models/user.model.js";
import { Subject } from "../../models/subject.model.js";
import { Message } from "../../models/message.model.js";
import { requireAuth } from "../../user.permission.js";

export const mutSendMessage = async (_, { content, SubjectId }, { user }) => {
  requireAuth(user);

  const subject = await Subject.findById(subjectId);
  const detailedUser = await User.findById(user._id);

  if (!subject.users.includes(user._id)) {
    throw new Error("Unauthorized");
  }

  const message = new Message({
    content,
    user: detailedUser,
    subject: subject, 
  });

  await message.save();

  return message;
};
