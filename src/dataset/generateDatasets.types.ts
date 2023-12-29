import {
  type Book,
  type BookAuthor,
  type Publisher,
  type LanguageCode,
  type BookImage,
  type Author,
  type BookImageSize,
} from "~/server/db/schema";

export type BooksDataInserts = {
  books: Book[];
  bookAuthors: BookAuthor[];
  authors: Author[];
  publishers: Publisher[];
  languageCodes: LanguageCode[];
  bookImages: BookImage[];
};

export type BookImageMapItem = { size: BookImageSize; url: string };
