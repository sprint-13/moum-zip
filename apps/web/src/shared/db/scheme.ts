import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, date, index, integer, jsonb, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

export const spaces = pgTable("spaces", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  meetingId: integer("meeting_id").notNull().unique(),
  location: text("location", { enum: ["online", "offline"] }).notNull(),
  themeColor: text("theme_color").notNull(),
  status: text("status", { enum: ["ongoing", "archived"] })
    .notNull()
    .default("ongoing"),
  modules: text("modules").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SpaceDB = InferSelectModel<typeof spaces>;
export type NewSpaceDB = InferInsertModel<typeof spaces>;

export const spaceMembers = pgTable("space_members", {
  id: text("id").primaryKey(),
  spaceId: text("space_id")
    .notNull()
    .references(() => spaces.id),
  userId: integer("user_id").notNull(),
  role: text("role", { enum: ["manager", "moderator", "member"] }).notNull(),
  nickname: text("nickname").notNull(),
  avatarUrl: text("avatar_url"),
  email: text("email"),
  joinedAt: timestamp("joined_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

// 1. 조회용 (Select) 타입: 실제 DB에서 가져온 데이터의 모양
export type Member = InferSelectModel<typeof spaceMembers>;

// 2. 삽입용 (Insert) 타입: 데이터를 넣을 때 쓰는 모양 (id, joinedAt 등 기본값이 있는 필드는 선택사항이 됨)
export type NewMember = InferInsertModel<typeof spaceMembers>;

export const spacePosts = pgTable(
  "space_posts",
  {
    id: text("id").primaryKey(),
    spaceId: text("space_id")
      .notNull()
      .references(() => spaces.id),
    authorId: integer("author_id").notNull(),
    category: text("category", {
      enum: ["notice", "discussion", "question", "material"],
    }).notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    image: text("image"),
    viewCount: integer("view_count").notNull().default(0),
    likeCount: integer("like_count").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("space_posts_space_author_created_idx").on(table.spaceId, table.authorId, table.createdAt)],
);

export type SpacePost = InferSelectModel<typeof spacePosts>;
export type NewSpacePost = InferInsertModel<typeof spacePosts>;

export const spacePostComments = pgTable(
  "space_post_comments",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => spacePosts.id, { onDelete: "cascade" }),
    spaceId: text("space_id")
      .notNull()
      .references(() => spaces.id),
    authorId: integer("author_id").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("space_post_comments_space_author_created_idx").on(table.spaceId, table.authorId, table.createdAt)],
);

export type SpacePostComment = InferSelectModel<typeof spacePostComments>;
export type NewSpacePostComment = InferInsertModel<typeof spacePostComments>;

export const spacePostLikes = pgTable(
  "space_post_likes",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => spacePosts.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [unique().on(table.postId, table.userId)],
);

export const schedules = pgTable("schedules", {
  id: text("id").primaryKey(),
  spaceId: text("space_id")
    .notNull()
    .references(() => spaces.id),
  createdBy: integer("created_by").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  startAt: timestamp("start_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Schedule = InferSelectModel<typeof schedules>;
export type NewSchedule = InferInsertModel<typeof schedules>;

export const files = pgTable("files", {
  id: text("id").primaryKey(),
  spaceId: text("space_id")
    .notNull()
    .references(() => spaces.id),
  uploadedBy: integer("uploaded_by").notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  size: integer("size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const attendances = pgTable(
  "attendances",
  {
    id: text("id").primaryKey(),
    spaceId: text("space_id")
      .notNull()
      .references(() => spaces.id),
    userId: integer("user_id").notNull(),
    date: date("date").notNull(),
    checkedAt: timestamp("checked_at").defaultNow(),
  },
  (table) => [unique().on(table.spaceId, table.userId, table.date)],
);

export type Attendance = InferSelectModel<typeof attendances>;
export type NewAttendance = InferInsertModel<typeof attendances>;

export const notifications = pgTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    teamId: text("team_id").notNull(),
    userId: integer("user_id").notNull(),
    type: text("type").notNull(),
    message: text("message").notNull(),
    data: jsonb("data").notNull().default({}),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("notifications_user_read_idx").on(table.userId, table.isRead),
    index("notifications_user_created_idx").on(table.userId, table.createdAt),
  ],
);

export type NotificationDB = InferSelectModel<typeof notifications>;
export type NewNotificationDB = InferInsertModel<typeof notifications>;
