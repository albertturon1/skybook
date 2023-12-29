import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export enum DBTable {
  book = "book",
  bookAuthor = "bookAuthor",
  user = "user",
  languageCode = "languageCode",
  author = "author",
  bookCover = "bookCover",
  publisher = "publisher",
  payment = "payment",
  reservation = "reservation",
}

//------- TYPES --------
export type Book = InferSelectModel<typeof bookTable>;
export type InsertBook = InferInsertModel<typeof bookTable>;

export type BookAuthor = InferSelectModel<typeof bookAuthorTable>;
export type InsertBookAuthor = InferInsertModel<typeof bookAuthorTable>;

export type User = InferSelectModel<typeof userTable>;

export type LanguageCode = InferSelectModel<typeof languageCodeTable>;
export type InsertLanguageCode = InferInsertModel<typeof languageCodeTable>;

export type Author = InferSelectModel<typeof authorTable>;
export type InsertAuthor = InferInsertModel<typeof authorTable>;

export type BookImage = InferSelectModel<typeof bookCoverTable>;
export type InsertBookImage = InferInsertModel<typeof bookCoverTable>;

export type Publisher = InferSelectModel<typeof publisherTable>;
export type InsertPublisher = InferInsertModel<typeof publisherTable>;

//------- SCHEMAS --------
export const paymentTable = sqliteTable(DBTable.payment, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  amount: real("amount").notNull(),
  status: text("status", { length: 255 }).notNull(),
});

export const reservationTable = sqliteTable(DBTable.reservation, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  user_id: integer("user_id").references(() => userTable.id, { onDelete: "cascade" }),
  payment_id: integer("payment_id").references(() => paymentTable.id, { onDelete: "cascade" }),
});

export const userTable = sqliteTable(DBTable.user, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 255 }),
  email: text("email", { length: 255 }).notNull(),
  email_verified: integer("email_verified", { mode: "timestamp" }),
  image: text("image", { length: 255 }),
});

//------- DATASET RELATED TABLES --------
export const languageCodeTable = sqliteTable(DBTable.languageCode, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
});

export const authorTable = sqliteTable(DBTable.author, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  author: text("author", { length: 255 }).notNull().unique(),
});

export const publisherTable = sqliteTable(DBTable.publisher, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  publisher: text("publisher", { length: 255 }).notNull().unique(),
});

export const bookTable = sqliteTable(DBTable.book, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  isbn: text("isbn").notNull(),
  isbn13: text("isbn13"),
  num_pages: integer("num_pages"),
  average_rating: real("average_rating"),
  ratings_count: integer("ratings_count"),
  text_reviews_count: integer("text_reviews_count"),
  publication_date: text("publication_date"),
  language_code_id: integer("language_code_id").references(() => languageCodeTable.id, { onDelete: "cascade" }),
  publisher_id: integer("publisher_id").references(() => publisherTable.id, { onDelete: "set null" }),
});

export const bookAuthorTable = sqliteTable(DBTable.bookAuthor, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  book_id: integer("book_id")
    .references(() => bookTable.id, { onDelete: "cascade" })
    .notNull(),
  author_id: integer("author_id")
    .references(() => authorTable.id, { onDelete: "cascade" })
    .notNull(),
});

//TS enum, because for today there is CHECK in drizzle-orm (SQLite doesn't have enums)
export enum BookImageSize {
  small = "small",
  medium = "medium",
  large = "large",
}

export const bookCoverTable = sqliteTable(DBTable.bookCover, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  book_id: integer("book_id")
    .references(() => bookTable.id, { onDelete: "cascade" })
    .notNull(),
  size: text("size").notNull(),
  url: text("url").notNull(),
});

//------- RELATIONS --------

export const bookTableRelations = relations(bookTable, ({ many, one }) => ({
  bookCoverTable: many(bookCoverTable),
  bookAuthorTable: many(bookAuthorTable),
  publisherTable: one(publisherTable, { fields: [bookTable.publisher_id], references: [publisherTable.id] }),
  languageCodeTable: one(languageCodeTable, {
    fields: [bookTable.language_code_id],
    references: [languageCodeTable.id],
  }),
}));

export const bookCoverTableRelations = relations(bookCoverTable, ({ one }) => ({
  bookTable: one(bookTable, { fields: [bookCoverTable.book_id], references: [bookTable.id] }),
}));

export const bookAuthorTableRelations = relations(bookAuthorTable, ({ one }) => ({
  bookTable: one(bookTable, { fields: [bookAuthorTable.book_id], references: [bookTable.id] }),
}));
