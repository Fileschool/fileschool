import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const shares = sqliteTable(
  "shares",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull().unique(),
    handle: text("handle").notNull(),
    url: text("url").notNull(),
    filename: text("filename").notNull(),
    mimetype: text("mimetype").notNull(),
    size: integer("size").notNull(),
    views: integer("views").notNull().default(0),
    createdAt: integer("created_at").notNull(),
    fingerprint: text("fingerprint").notNull().default(""),
  },
  (t) => [
    index("shares_code_idx").on(t.code),
    index("shares_fingerprint_idx").on(t.fingerprint),
  ],
);

export type Share = typeof shares.$inferSelect;
export type NewShare = typeof shares.$inferInsert;
