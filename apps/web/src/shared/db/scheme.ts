import { date, integer, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

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
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const spacePosts = pgTable("space_posts", {
  id: text("id").primaryKey(),
  spaceId: text("space_id")
    .notNull()
    .references(() => spaces.id),
  postId: integer("post_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

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
