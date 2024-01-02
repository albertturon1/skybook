import { relations, type InferSelectModel } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export enum DBTable {
  book = "book",
  authorRole = "authorRole",
  author = "author",
  genre = "genre",
  language = "language",
  publisher = "publisher",
  bookAuthor = "bookAuthor",
  bookAuthorRole = "bookAuthorRole",
  bookGenre = "bookGenre",
  bookStarRating = "bookStarRating",
  reservation = "reservation",
  payment = "payment",
  user = "user",
}

//------- TYPES --------
export type Book = InferSelectModel<typeof bookTable>;
export type BookAuthor = InferSelectModel<typeof bookAuthorTable>;
export type BookAuthorRole = InferSelectModel<typeof bookAuthorRoleTable>;
export type Language = InferSelectModel<typeof languageTable>;
export type Author = InferSelectModel<typeof authorTable>;
export type Publisher = InferSelectModel<typeof publisherTable>;
export type Genre = InferSelectModel<typeof genreTable>;
export type BookGenre = InferSelectModel<typeof bookGenreTable>;
export type AuthorRole = InferSelectModel<typeof authorRoleTable>;
export type BookStarRating = InferSelectModel<typeof bookStarRatingTable>;

export type User = InferSelectModel<typeof userTable>;

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
export const languageTable = sqliteTable(DBTable.language, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  language: text("language").notNull().unique(),
});

export const authorTable = sqliteTable(DBTable.author, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  author: text("author", { length: 255 }).notNull().unique(),
});

export const authorRoleTable = sqliteTable(DBTable.authorRole, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  author_role: text("author_role", { length: 255 }).notNull().unique(), //E.g Goodreads Author, Illustrator, etc.
});

export const publisherTable = sqliteTable(DBTable.publisher, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  publisher: text("publisher", { length: 255 }).notNull().unique(),
});

export const genreTable = sqliteTable(DBTable.genre, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  genre: text("genre").notNull().unique(),
});

export const bookTable = sqliteTable(DBTable.book, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  isbn: text("isbn").notNull(),
  description: text("description"),
  edition: text("edition"),
  pages: integer("pages"),
  price: real("price"),
  average_rating: real("average_rating"),
  ratings_count: integer("ratings_count"),
  liked_percent: integer("liked_percent"),
  publication_date: text("publication_date"),
  language_id: integer("language_id").references(() => languageTable.id, { onDelete: "set null" }),
  publisher_id: integer("publisher_id").references(() => publisherTable.id, { onDelete: "set null" }),
  cover_url: text("cover_url"),
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

//Star ratings from 1 to 5
export const StarRating = Array.from({ length: 5 }, (_, i) => i + 1);

export const bookStarRatingTable = sqliteTable(DBTable.bookStarRating, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  book_id: integer("book_id")
    .references(() => bookTable.id, { onDelete: "cascade" })
    .notNull(),
  ratings_count: integer("ratings_count").notNull(),
  star: integer("star").notNull(),
});

//if author has a special role e.g. Goodreads Author, Illustrator etc. then record in "bookAuthorRoleTable" will be created
export const bookAuthorRoleTable = sqliteTable(DBTable.bookAuthorRole, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  book_id: integer("book_id")
    .references(() => bookTable.id, { onDelete: "cascade" })
    .notNull(),
  book_author_id: integer("book_author_id")
    .references(() => bookAuthorTable.id, { onDelete: "cascade" })
    .notNull(),
  author_role_id: integer("author_role_id")
    .references(() => authorRoleTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const bookGenreTable = sqliteTable(DBTable.bookGenre, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  book_id: integer("book_id")
    .references(() => bookTable.id, { onDelete: "cascade" })
    .notNull(),
  genre_id: integer("genre_id")
    .references(() => genreTable.id, { onDelete: "cascade" })
    .notNull(),
});

//------- RELATIONS --------

export const bookTableRelations = relations(bookTable, ({ many, one }) => ({
  bookAuthorTable: many(bookAuthorTable),
  bookGenreTable: many(bookGenreTable),
  publisherTable: one(publisherTable, { fields: [bookTable.publisher_id], references: [publisherTable.id] }),
  languageTable: one(languageTable, {
    fields: [bookTable.language_id],
    references: [languageTable.id],
  }),
}));

export const bookAuthorTableRelations = relations(bookAuthorTable, ({ one }) => ({
  bookTable: one(bookTable, { fields: [bookAuthorTable.book_id], references: [bookTable.id] }),
  authorTable: one(authorTable, { fields: [bookAuthorTable.author_id], references: [authorTable.id] }),
}));

export const bookGenreTableRelations = relations(bookGenreTable, ({ one }) => ({
  bookTable: one(bookTable, { fields: [bookGenreTable.book_id], references: [bookTable.id] }),
  genreTable: one(genreTable, { fields: [bookGenreTable.genre_id], references: [genreTable.id] }),
}));

export const bookStarRatingTableRelations = relations(bookStarRatingTable, ({ one }) => ({
  bookTable: one(bookTable, { fields: [bookStarRatingTable.book_id], references: [bookTable.id] }),
}));

export const bookAuthorRoleTableRelations = relations(bookAuthorRoleTable, ({ one }) => ({
  bookTable: one(bookTable, { fields: [bookAuthorRoleTable.book_id], references: [bookTable.id] }),
  bookAuthorTable: one(bookAuthorTable, {
    fields: [bookAuthorRoleTable.book_author_id],
    references: [bookAuthorTable.id],
  }),
  authorRoleTable: one(authorRoleTable, {
    fields: [bookAuthorRoleTable.author_role_id],
    references: [authorRoleTable.id],
  }),
}));
