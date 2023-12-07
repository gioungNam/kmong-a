import { Subject } from "../../models/subject.model.js";
import { requireAuth } from "../../user.permission.js";
import { Notice } from "../../models/notice.model.js";

export const querySubjects = async () => {
  return Subject.find().populate("users");
};

export const querySubject = async (_, { subjectId }) => {
  const result = await Subject.findById(subjectId).populate("users");

  console.log(result);
  return result;
};

export const queryUserSubjects = async (_, __, { user }) => {
  requireAuth(user);
  return Subject.find({ users: user._id });
};

export const querySubjectGroups = async (_, { subjectId }, { user }) => {
  requireAuth(user);
  const subject = await Subject.findById(subjectId).populate("groups");
  return subject.groups;
};




