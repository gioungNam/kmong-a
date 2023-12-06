import { AuthenticationError } from "apollo-server";
import { Message } from "../../models/message.model.js";
import { Subject } from "../../models/subject.model.js"
import { requireAuth } from "../../user.permission.js";

export const queryMessages = async (_, { subjectId }, { user }) => {
  requireAuth(user);
  const subject = await Subject.findById(subjectId);
  
  const messages = await Message.find({ subject: subjectId })
  .populate({
    path: 'user',
    select: 'username',
  })
  .populate({
    path: 'subject',
    select: 'name',
  })
  .sort({ createdAt: 1 });

  const result = messages.map(message => ({
    ...message._doc,
    isCurrentUser: String(message.user._id) === String(user._id),
    subjectName: message.subject.name,
  }));

  return result;
};
