import { ApolloServer, gql } from "apollo-server";
import mongoose from "mongoose";
import {
  querySubjects,
  querySubject,
  queryUserSubjects
} from "./controller/query/query.subject.js";
import { mutCreateUser, mutAddFavorite, queryFavoriteNotices, mutCancelFavorite } from "./controller/mutation/mutation.user.js";
import { mutLogin } from "./controller/mutation/mutation.login.js";
import {
  mutAddUserToSubject,
  mutCreateSubject,
} from "./controller/mutation/mutation.subject.js";
import { queryUser, queryUsers } from "./controller/query/query.user.js";
import { getUserFromToken } from "./user.permission.js";
import { createAdmin } from "./admin.js";
import { initData } from "./info.js";
import "dotenv/config";
import { mutCreateNotice, mutUpdateNoticePinnedStatus } from "./controller/mutation/mutation.notice.js";
import { queryNotices, queryNotice, querySubjectNotices} from "./controller/query/query.notice.js";
import { queryUserNotices, queryCheckUserNotice } from "./controller/query/query.usernotice.js";
import { mutUpdateUserNoticePinnedStatus} from "./controller/mutation/mutatioin.usernotice.js"

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  console.log("MongoDataBase is connected");

  try {
    await createAdmin();
    // await initData();
    console.log("Admin user checked successfully");
  } catch (error) {
    console.error("Error checking admin user:", error);
  }

  const typeDefs = gql`
    scalar DateTime

    type Query {
      subjects: [Subject]
      subject(subjectId: ID!): Subject
      userSubjects(userId: ID!): [Subject]
      users: [User]
      user(userId: ID!): User
      notices: [Notice]
      notice(NoticeId: ID!): Notice 
      UserNotices(userId: ID!): [UserNotice] 
      CheckUserNotice(userId: ID!, NoticeId: ID!): UserNotice
      subjectNotices(subjectId: ID!): [Notice],
      favoriteNotices(userId: ID!): [Notice]
    }

    type Mutation {
      createUser(username: String!, email: String!, password: String!): User
      login(id: String!, password: String!): AuthPayload
      createSubject(name: String!, credit: Int, classification: String): Subject
      addUserToSubject(subjectId: ID!, userId: ID!): Subject
      createNotice(title: String!, content: String!, subject: ID!): Notice
      updateNoticePinnedStatus(noticeId: ID!, isPinned: Boolean!): Notice
      updateUserNoticePinnedStatus(userId: ID!, noticeId: ID!, isPinned: Boolean): UserNotice
      addFavorite(userId: ID!, noticeId: String!): UserNotice
      cancelFavorite(userId: ID!, noticeId: String!): UserNotice
    }

    type Notice { 
      _id: ID!
      title: String!
      content: String!
      isPinned: Boolean!
      subject: Subject!
    }


    type User {
      _id: ID!
      username: String!
      email: String!
      password: String!
      subjects: [Subject!]!
      isAdmin: Boolean!
      tokenExpiration: Int!
    }

    input AssignmentPeriodInput {
      start: DateTime!
      end: DateTime!
    }

    type AssignmentPeriod {
      start: DateTime!
      end: DateTime!
    }

    type AuthPayload {
      token: String!
      user: User!
    }

    type Subject {
      _id: ID!
      name: String!
      credit: Int
      classification: String
      openurl: String
      capacity: Int
      users: [User!]!
      notices: [Notice!]!
    }

    type UserNotice {
      _id: ID!
      user: User!
      notice: Notice!
      isPinned: Boolean!
    }
  `;

  const resolvers = {
    Query: {
      subjects: querySubjects,
      subject: querySubject,
      userSubjects: queryUserSubjects,
      users: queryUsers,
      user: queryUser,
      notices: queryNotices,
      notice: queryNotice,
      UserNotices: queryUserNotices,
      CheckUserNotice: queryCheckUserNotice,
      subjectNotices: querySubjectNotices,
      favoriteNotices: queryFavoriteNotices

    },

    Mutation: {
      createUser: mutCreateUser,
      login: mutLogin,
      createSubject: mutCreateSubject,
      addUserToSubject: mutAddUserToSubject,
      createNotice: mutCreateNotice,
      updateNoticePinnedStatus: mutUpdateNoticePinnedStatus,
      updateUserNoticePinnedStatus: mutUpdateUserNoticePinnedStatus,
      addFavorite: mutAddFavorite,
      cancelFavorite: mutCancelFavorite
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization;
      const user = await getUserFromToken(token);
      return { user };  
    },
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`Server running at ${url}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});