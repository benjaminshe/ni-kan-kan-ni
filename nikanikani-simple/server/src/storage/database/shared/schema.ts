import { pgTable, serial, timestamp, varchar, integer, text, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 使用会话记录表
export const sessions = pgTable("sessions", {
	id: serial().primaryKey(),
	deviceId: varchar("device_id", { length: 255 }).notNull(),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).notNull(),
	endedAt: timestamp("ended_at", { withTimezone: true, mode: 'string' }),
	durationSeconds: integer("duration_seconds").notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("sessions_device_id_idx").on(table.deviceId),
	index("sessions_started_at_idx").on(table.startedAt),
]);

// 内容分类表
export const categories = pgTable("categories", {
	id: serial().primaryKey(),
	name: varchar("name", { length: 100 }).notNull().unique(),
	icon: varchar("icon", { length: 50 }),
	color: varchar("color", { length: 20 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// 内容记录表
export const contentRecords = pgTable("content_records", {
	id: serial().primaryKey(),
	deviceId: varchar("device_id", { length: 255 }).notNull(),
	categoryId: integer("category_id").notNull().references(() => categories.id),
	contentTitle: varchar("content_title", { length: 255 }).notNull(),
	contentDescription: text("content_description"),
	durationSeconds: integer("duration_seconds").notNull().default(0),
	recordedAt: timestamp("recorded_at", { withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("content_records_device_id_idx").on(table.deviceId),
	index("content_records_category_id_idx").on(table.categoryId),
	index("content_records_recorded_at_idx").on(table.recordedAt),
]);
