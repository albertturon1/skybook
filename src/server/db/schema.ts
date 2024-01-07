import { relations, type InferSelectModel } from "drizzle-orm";
import { text, integer, sqliteTable, real, primaryKey } from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

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
  verificationToken = "verificationToken",
  account = "account",
}

//------- TYPES --------
export type Book = InferSelectModel<typeof books>;
export type BookAuthor = InferSelectModel<typeof bookAuthors>;
export type BookAuthorRole = InferSelectModel<typeof bookAuthorRoles>;
export type Language = InferSelectModel<typeof languages>;
export type Author = InferSelectModel<typeof authors>;
export type Publisher = InferSelectModel<typeof publishers>;
export type Genre = InferSelectModel<typeof genres>;
export type BookGenre = InferSelectModel<typeof bookGenres>;
export type AuthorRole = InferSelectModel<typeof authorRoles>;
export type BookStarRating = InferSelectModel<typeof bookStarRatings>;
export type User = InferSelectModel<typeof users>;

//------- SCHEMAS --------
export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

//------- DATASET RELATED TABLES --------
export const languages = sqliteTable(DBTable.language, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  language: text("language").notNull().unique(),
});

export const authors = sqliteTable(DBTable.author, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  author: text("author", { length: 255 }).notNull().unique(),
});

export const authorRoles = sqliteTable(DBTable.authorRole, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  author_role: text("author_role", { length: 255 }).notNull().unique(), //E.g Goodreads Author, Illustrator, etc.
});

export const publishers = sqliteTable(DBTable.publisher, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  publisher: text("publisher", { length: 255 }).notNull().unique(),
});

export const genres = sqliteTable(DBTable.genre, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  genre: text("genre").notNull().unique(),
});

export const books = sqliteTable(DBTable.book, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  isbn: text("isbn").notNull(),
  description: text("description"),
  edition: text("edition"),
  pages: integer("pages"),
  price: real("price").notNull(),
  average_rating: real("average_rating"),
  ratings_count: integer("ratings_count"),
  liked_percent: integer("liked_percent"),
  publication_date: text("publication_date"),
  language_id: integer("language_id").references(() => languages.id, { onDelete: "set null" }),
  publisher_id: integer("publisher_id").references(() => publishers.id, { onDelete: "set null" }),
  cover_url: text("cover_url").notNull(),
});

export const bookAuthors = sqliteTable(DBTable.bookAuthor, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  book_id: integer("book_id")
    .references(() => books.id, { onDelete: "cascade" })
    .notNull(),
  author_id: integer("author_id")
    .references(() => authors.id, { onDelete: "cascade" })
    .notNull(),
});

//Star ratings from 1 to 5
export const STARTS_RATING_RANGE = 5;

export const bookStarRatings = sqliteTable(DBTable.bookStarRating, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  book_id: integer("book_id")
    .references(() => books.id, { onDelete: "cascade" })
    .notNull(),
  ratings_count: integer("ratings_count").notNull(),
  star: integer("star").notNull(),
});

//if author has a special role e.g. Goodreads Author, Illustrator etc. then record in "bookAuthorRoles" will be created
export const bookAuthorRoles = sqliteTable(DBTable.bookAuthorRole, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  book_id: integer("book_id")
    .references(() => books.id, { onDelete: "cascade" })
    .notNull(),
  book_author_id: integer("book_author_id")
    .references(() => bookAuthors.id, { onDelete: "cascade" })
    .notNull(),
  author_role_id: integer("author_role_id")
    .references(() => authorRoles.id, { onDelete: "cascade" })
    .notNull(),
});

export const bookGenres = sqliteTable(DBTable.bookGenre, {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  book_id: integer("book_id")
    .references(() => books.id, { onDelete: "cascade" })
    .notNull(),
  genre_id: integer("genre_id")
    .references(() => genres.id, { onDelete: "cascade" })
    .notNull(),
});

//------- RELATIONS --------

export const bookTableRelations = relations(books, ({ many, one }) => ({
  bookAuthors: many(bookAuthors),
  bookGenres: many(bookGenres),
  bookStarRatings: many(bookStarRatings),
  publishers: one(publishers, { fields: [books.publisher_id], references: [publishers.id] }),
  languages: one(languages, {
    fields: [books.language_id],
    references: [languages.id],
  }),
}));

export const bookAuthorTableRelations = relations(bookAuthors, ({ one }) => ({
  books: one(books, { fields: [bookAuthors.book_id], references: [books.id] }),
  authors: one(authors, { fields: [bookAuthors.author_id], references: [authors.id] }),
}));

export const bookGenreTableRelations = relations(bookGenres, ({ one }) => ({
  books: one(books, { fields: [bookGenres.book_id], references: [books.id] }),
  genres: one(genres, { fields: [bookGenres.genre_id], references: [genres.id] }),
}));

export const bookStarRatingTableRelations = relations(bookStarRatings, ({ one }) => ({
  books: one(books, { fields: [bookStarRatings.book_id], references: [books.id] }),
}));

export const bookAuthorRoleTableRelations = relations(bookAuthorRoles, ({ one }) => ({
  books: one(books, { fields: [bookAuthorRoles.book_id], references: [books.id] }),
  bookAuthors: one(bookAuthors, {
    fields: [bookAuthorRoles.book_author_id],
    references: [bookAuthors.id],
  }),
  authorRoles: one(authorRoles, {
    fields: [bookAuthorRoles.author_role_id],
    references: [authorRoles.id],
  }),
}));
