export type BookWithImage = {
  ISBN: string;
  "Book-Title": string | undefined;
  "Book-Author": string | undefined;
  "Year-Of-Publication": string | undefined;
  Publisher: string | undefined;
  "Image-URL-S": string | undefined;
  "Image-URL-M": string | undefined;
  "Image-URL-L": string | undefined;
};

export type CSVBook = {
  bookID: string; //A unique Identification number for each book.
  title: string; //The name under which the book was published.
  authors?: string; //Names of the authors of the book. Multiple authors are delimited with -.
  average_rating?: string; //The average rating of the book received in total.
  isbn?: string; //Another unique number to identify the book, the International Standard Book Number.
  isbn13?: string; //A 13-digit ISBN to identify the book, instead of the standard 11-digit ISBN.
  language_code?: string; //Helps understand what is the primary language of the book. For instance, eng is standard for English.
  num_pages?: string; //Number of pages the book contains.
  ratings_count?: string; //Total number of ratings the book received.
  text_reviews_count?: string; //Total number of written text reviews the book received.
  publication_date?: string; //Date when the book was first published.
  publisher?: string; //The name of the publisher.
  [x: string]: unknown;
};
