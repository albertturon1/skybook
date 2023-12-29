import fs from "fs";
import chalk from "chalk";
import csv, { type Options } from "csv-parser";
import {
  type Book,
  type BookImage,
  type BookAuthor,
  type Author,
  type Publisher,
  type LanguageCode,
} from "~/server/db/schema";
import { csvBookSchema } from "./generateDatasets.helpers";
import { type CSVBook } from "./dataset.types";
import { type BookImageMapItem, type BooksDataInserts } from "./generateDatasets.types";

const publishersMap = new Map<string, number>();
const authorsMap = new Map<string, number>();
const languageCodesMap = new Map<string, number>();

const BOOKS_PATH = "./src/dataset/books.csv";

const CONFIG: Options = {
  mapHeaders: ({ header }) => header.trim(),
};

/**
 * @returns Object with properties that will be inserted into database
 */
export function getBookCSVData(bookImagesMap: Map<string, BookImageMapItem[]>): Promise<BooksDataInserts> {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue("--- READING CSV BOOKS - START"));

    const books: Book[] = [];
    const bookAuthors: BookAuthor[] = [];
    const bookImages: BookImage[] = [];

    fs.createReadStream(BOOKS_PATH)
      .pipe(csv(CONFIG))
      .on("data", (row: CSVBook) => {
        //skipping rows without book covers
        if (!row.isbn || !bookImagesMap.has(row.isbn)) {
          return;
        }

        //parsing book to check if row has all required values
        const parsedBook = csvBookSchema.safeParse(row);
        if (!parsedBook.success) {
          //skipping row if it doesn't meet the requirements
          return;
        }
        const book = parsedBook.data;

        const language_code = book.language_code ?? null;
        const id = books.length;
        const publication_date = book.publication_date ? book.publication_date.split("/").reverse().join("-") : null;

        //------- authorTable --------
        const authors = book.authors ? book.authors.split("/") : null;
        if (authors) {
          authors.forEach((author) => {
            //adding author to Map
            if (!authorsMap.has(author)) {
              authorsMap.set(author, authorsMap.size);
            }
          });

          authors.forEach((author) => {
            const args = {
              id: bookAuthors.length,
              book_id: id,
              //! because author has already been check in the if statement above
              author_id: authorsMap.get(author)!,
            };

            bookAuthors.push(args);
          });
        }

        //------- languageCodeTable --------
        if (language_code && !languageCodesMap.has(language_code)) {
          languageCodesMap.set(language_code, languageCodesMap.size);
        }

        //------- publisherTable --------
        const publisher = book.publisher ?? null;
        if (publisher && !publishersMap.has(publisher)) {
          publishersMap.set(publisher, publishersMap.size);
        }

        //------- bookTable --------
        const transformedRow: Book = {
          id,
          title: book.title,
          isbn: book.isbn,
          isbn13: book.isbn13 ?? null,
          average_rating: book.average_rating ? Number(book.average_rating) : null,
          num_pages: book.num_pages ? Number(book.num_pages) : null,
          ratings_count: book.ratings_count ? Number(book.ratings_count) : null,
          publication_date,
          text_reviews_count: book.text_reviews_count ? Number(book.text_reviews_count) : null,
          language_code_id: language_code ? languageCodesMap.get(language_code)! : null,
          //already checked above
          publisher_id: publisher ? publishersMap.get(publisher)! : null,
        };

        books.push(transformedRow);

        //BOOK IMAGES
        bookImagesMap.get(book.isbn)?.forEach((props) => {
          const image = { book_id: id, id: bookImages.length, ...props } satisfies BookImage;
          bookImages.push(image);
        });
      })
      .on("end", () => {
        console.log(chalk.green("--- READING CSV BOOKS - END\n"));

        const authors: Author[] = Array.from(authorsMap, (entry) => {
          return {
            id: entry[1],
            author: entry[0],
          };
        });

        const publishers: Publisher[] = Array.from(publishersMap, (entry) => {
          return {
            id: entry[1],
            publisher: entry[0],
          };
        });

        const languageCodes: LanguageCode[] = Array.from(languageCodesMap, (entry) => {
          return {
            id: entry[1],
            code: entry[0],
          };
        });

        resolve({ books, bookAuthors, authors, publishers, languageCodes, bookImages });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
