import { Subject } from "../../models/subject.model.js";
import { Notice } from "../../models/notice.model.js";
import { requireAuth } from "../../user.permission.js";
import { AuthenticationError } from "apollo-server";

//새로운 과목 생성
export const mutCreateSubject = async (
  _,
  { name, credit, classification},
  { user }
) => {
  requireAuth(user); //사용자가 관리자인지 확인
  if (!user.isAdmin) {
    throw new AuthenticationError(
      "Unauthorized: Only admins can create subjects"
    );
  }//유효성 검사
  if (!name || name.trim() === "") {
    throw new Error("Subject name is required");
  }
  if (name.length > 50) {
    throw new Error("Subject name should not exceed 50 characters");
  }
  if (credit && (credit < 0 || credit > 4)) {
    throw new Error("Credit should be between 0 and 4");
  }
  const subject = new Subject({
    name,
    credit,
    classification,
    users: [user._id],
  });
  return subject.save();
};

//과목에 사용자 추가
export const mutAddUserToSubject = async (
  _,
  { subjectId, userId },
  { user }
) => {
  requireAuth(user); //사용자 권한 확인
  const subject = await Subject.findById(subjectId); //과목을 데이터베이스에서 찾음
  if (!user.isAdmin) {
    throw new AuthenticationError(
      "Unauthorized: Only admins can add users to subjects"
    );
  }
  if (!subject) {
    throw new Error("Subject not found");
  }
  if (!subject.users.includes(userId)) {   //사용자를 배열에 추가
    subject.users.push(userId);
    await subject.save();
  }
  return Subject.populate(subject, "users"); //업데이트된 사용자 정보 반환
};

//과목에 공지를 추가
export const mutAddNoticeToSubject = async (
  _,
  { subjectId, noticeId },
  { user }
) => {
  requireAuth(user);

  if (!user.isAdmin) {    // 사용자가 관리자인지 확인
    throw new AuthenticationError(
      "Unauthorized: Only admins can add notices to subjects"
    );
  }

  const subject = await Subject.findById(subjectId); //과목을 데이터베이스에서 찾음

  if (!subject) {
    throw new Error("Subject not found");
  }

  const notice = await Notice.findById(noticeId); //공지를 데이터베이스에서 찾음

  if (!notice) {
    throw new Error("Notice not found");
  }
  subject.notices.push(noticeId);  // 과목의 notices 배열에 공지 ID를 추가
  await subject.save();  // 과목을 저장하고 반환

  return subject;  // 수정된 과목을 반환
};
