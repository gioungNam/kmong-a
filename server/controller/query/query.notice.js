import { Notice } from "../../models/notice.model.js";
import { Subject } from "../../models/subject.model.js";
import { AuthenticationError } from "apollo-server";
import { requireAuth } from "../../user.permission.js";

export const queryNotices = async () => {
  return Subject.find().populate("notices");
};

export const queryNotice = async (_, { NoticeId }, { user }) => {
  requireAuth(user);
  const notice = await Notice.findById(NoticeId);
  if (!notice) throw new Error("Notice not found");
  return notice;
};

export const querySubjectNotices = async (_, { subjectId }) => {

  // subjectId로 해당하는 Subject 찾기
  const subject = await Subject.findById(subjectId);

  if (!subject) {
    throw new Error("과목을 찾을 수 없습니다."); // 예외 처리: 과목이 없는 경우
  }

  // subject.notices 배열에 소속된 모든 공지 찾기
  const notices = await Notice.find({ _id: { $in: subject.notices } });

  return notices;
};

