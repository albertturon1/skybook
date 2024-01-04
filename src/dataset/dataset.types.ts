import {
  type Book,
  type BookAuthor,
  type Publisher,
  type Language,
  type Author,
  type Genre,
  type BookAuthorRole,
  type AuthorRole,
  type BookGenre,
} from "~/server/db/schema";

export type CSVBook = Partial<{
  bookId: string;
  title: string;
  series: string;
  author: string;
  rating: string;
  description: string;
  language: string;
  isbn: string; //can be also ASIN, will be skipped when occurs
  genres: string;
  characters: string;
  bookFormat: string;
  edition: string;
  pages: string;
  publisher: string;
  publishDate: string;
  firstPublishDate: string;
  awards: string;
  numRatings: string;
  ratingsByStars: string;
  likedPercent: string;
  setting: string;
  coverImg: string;
  bbeScore: string;
  bbeVotes: string;
  price: string;
}>;

export type BooksDataInserts = {
  booksData: Book[];
  bookAuthorsData: BookAuthor[];
  authorsData: Author[];
  publishersData: Publisher[];
  languagesData: Language[];
  genresData: Genre[];
  bookGenresData: BookGenre[];
  bookAuthorRolesData: BookAuthorRole[];
  authorRolesData: AuthorRole[];
};
