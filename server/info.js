import { User } from "./models/user.model.js";
import { Subject } from "./models/subject.model.js";
import { Notice } from "./models/notice.model.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const passwordLogPath = path.join(__dirname, "passwords.log");

const courseTypes = ["학기", "일교", "공교", "전공", "전필", "전선"];

const firstNames = [
  "지훈",
  "현우",
  "서준",
  "도윤",
  "하준",
  "지호",
  "준서",
  "예빈",
  "준우",
  "시우",
  "유준",
  "지우",
  "지후",
  "윤서",
  "서연",
  "민영",
  "준호",
  "유찬",
  "지환",
  "윤우",
  "민준",
  "재윤",
  "서진",
  "시윤",
  "도준",
  "세아",
  "유빈",
  "민지",
  "정훈",
  "연서",
  "유나",
  "소영",
];

const lastNames = [
  "김",
  "이",
  "박",
  "최",
  "정",
  "성",
  "강",
  "조",
  "윤",
  "장",
  "임",
  "오",
  "한",
  "신",
  "서",
  "권",
  "황",
  "안",
  "송",
  "류",
  "홍",
  "고",
  "진",
  "허",
];

function generateRandomPassword() {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset[Math.floor(Math.random() * n)];
  }
  return password;
}

const getRandomKoreanName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return lastName + firstName;
};

//랜덤 날짜
//const getRandomDateIn2023 = () => {
//  const start = new Date(2023, 0, 1); // January 1, 2023
//  const end = new Date(2023, 11, 31); // December 31, 2023
//  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
//};

const MAX_CONCURRENT_SAVES = 100;

//사용자에 과목을 할당
async function assignSubjectsToUsers(users, subjects) {
  const saveQueue = [];

  for (let user of users) {
    const numSubjects = Math.floor(Math.random() * (7 - 4)) + 4;

    let availableSubjects = [...subjects];

    while (user.subjects.length < numSubjects && availableSubjects.length > 0) {
      let subjectIndex = Math.floor(Math.random() * availableSubjects.length);
      let subject = availableSubjects[subjectIndex];

      if (subject.users.length < subject.capacity) {
        user.subjects.push(subject._id);
        subject.users.push(user._id);

        saveQueue.push(subject.save());

        if (saveQueue.length >= MAX_CONCURRENT_SAVES) {
          await Promise.allSettled(saveQueue);
          saveQueue.length = 0;
        }

        availableSubjects.splice(subjectIndex, 1);
      } else {
        availableSubjects.splice(subjectIndex, 1);
      }
    }

    saveQueue.push(user.save());
    if (saveQueue.length >= MAX_CONCURRENT_SAVES) {
      await Promise.allSettled(saveQueue);
      saveQueue.length = 0;
    }
  }

  if (saveQueue.length > 0) {
    await Promise.allSettled(saveQueue);
  }
}

//최대 공지사항 수를 지정
const MAX_NOTICES_PER_SUBJECT = 5;

//과목에 공지 할당
async function assignNoticesToSubjects(subjects) {
  for (let subject of subjects) {
    const numNoticesToAssign = Math.floor(Math.random() * MAX_NOTICES_PER_SUBJECT) + 1;
    const availableNotices = await Notice.find({ subject: { $exists: false } }).limit(numNoticesToAssign);

    for (let i = 0; i < Math.min(numNoticesToAssign, availableNotices.length); i++) {
      const notice = availableNotices[i];
      notice.subject = subject._id;
      await notice.save();

      // 해당 notice를 subject에 추가
      subject.notices.push(notice._id);
      await subject.save();
    }
  }
}


//초기 데이터 생성
export const initData = async () => {
  let subjects = [];
  for (let i = 0; i < 100; i++) {
    const credit = Math.floor(Math.random() * 3) + 1;
    const classification =
      courseTypes[Math.floor(Math.random() * courseTypes.length)];
    const capacity = Math.floor(Math.random() * (41 - 20)) + 20;
    let newSubject = new Subject({
      name: `Subject-${i}`,
      credit,
      classification,
      capacity,
    });
    await newSubject.save();
    subjects.push(newSubject);
  }

  let users = [];
  for (let i = 0; i < 1000; i++) {
    const username = getRandomKoreanName();
    const email =
      "2023" +
      String(Math.floor(Math.random() * 10 ** 6)).padStart(6, "0") +
      "@dgu.co.kr";
    const password = generateRandomPassword();
    const hashedPassword = bcrypt.hashSync(password, 10);

    fs.appendFileSync(passwordLogPath, `${username} ${email} ${password}\n`);

    let newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: false,
      tokenExpiration: 0,
    });

    await newUser.save();
    users.push(newUser);
  }

  let notices = [];
  for (let i = 0; i < 100; i++) {
    const title = `notice-${i}`;
    const content = title;
    const isPinned = false;
    //const date = getRandomDateIn2023();

    let newNotice = new Notice({
      title,
      content,
      isPinned,
    //  date,
    });

    await newNotice.save();
    notices.push(newNotice);
  }

  await assignSubjectsToUsers(users, subjects);
  await assignNoticesToSubjects(subjects);
};