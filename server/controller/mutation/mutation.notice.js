import { Notice } from "../../models/notice.model.js";

export const mutCreateNotice = async (_, { title, content, subject }) => {
  // 공지 생성
  const newNotice = new Notice({
    title, //제목
    content, //내용
    subject, // 공지가 추가된 과목
   // date, // 작성일
  });

  await newNotice.save();  // 공지를 데이터베이스에 저장

  return newNotice;
};

// isPinned 값을 업데이트하는 함수
export const mutUpdateNoticePinnedStatus = async (_, { noticeId, isPinned }) => {
  // 공지사항을 데이터베이스에서 찾음
  const notice = await Notice.findById(noticeId);

  if (!notice) {
    throw new Error("Notice not found");
  }

  // isPinned 값을 업데이트
  notice.isPinned = isPinned;

  // 데이터베이스에 저장
  await notice.save();

  return notice; // 업데이트된 공지사항 반환
};