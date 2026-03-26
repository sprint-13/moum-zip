import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { date, doublePrecision, integer, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

export const meetings = pgTable("meetings", {
  id: integer("id").primaryKey(),
  teamId: text("team_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  region: text("region").notNull(),
  address: text("address"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  dateTime: timestamp("date_time"),
  registrationEnd: timestamp("registration_end"),
  capacity: integer("capacity").notNull(),
  participantCount: integer("participant_count").notNull(),
  image: text("image"),
  description: text("description"),
  canceledAt: timestamp("canceled_at"),
  confirmedAt: timestamp("confirmed_at"),
  hostId: integer("host_id").notNull(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const participants = pgTable("participants", {
  id: integer("id").primaryKey(),
  teamId: text("team_id").notNull(),
  meetingId: integer("meeting_id")
    .notNull()
    .references(() => meetings.id),
  userId: integer("user_id").notNull(),
  joinedAt: timestamp("joined_at"),
});

export const favorites = pgTable("favorites", {
  id: integer("id").primaryKey(),
  teamId: text("team_id").notNull(),
  meetingId: integer("meeting_id")
    .notNull()
    .references(() => meetings.id),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at"),
});

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

export const spaceMembers = pgTable("space_members", {
  id: text("id").primaryKey(),
  spaceId: text("space_id")
    .notNull()
    .references(() => spaces.id),
  userId: integer("user_id").notNull(),
  role: text("role", { enum: ["manager", "moderator", "member"] }).notNull(),
  nickname: text("nickname").notNull(),
  avatarUrl: text("avatar_url"),
  email: text("email").notNull(),
  joinedAt: timestamp("joined_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

// 1. 조회용 (Select) 타입: 실제 DB에서 가져온 데이터의 모양
export type Member = InferSelectModel<typeof spaceMembers>;

// 2. 삽입용 (Insert) 타입: 데이터를 넣을 때 쓰는 모양 (id, joinedAt 등 기본값이 있는 필드는 선택사항이 됨)
export type NewMember = InferInsertModel<typeof spaceMembers>;

export const spacePosts = pgTable("space_posts", {
  id: text("id").primaryKey(),
  spaceId: text("space_id")
    .notNull()
    .references(() => spaces.id),
  postId: integer("post_id").notNull(),
  category: text("category", { enum: ["notice", "discussion", "question", "material"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SpacePost = InferSelectModel<typeof spacePosts>;

export type NewSpacePost = InferInsertModel<typeof spacePosts>;

export const schedules = pgTable("schedules", {
  id: text("id").primaryKey(),
  spaceId: text("space_id")
    .notNull()
    .references(() => spaces.id),
  createdBy: integer("created_by").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

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
