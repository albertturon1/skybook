import fs from "fs";
import chalk from "chalk";
import csv, { type Options } from "csv-parser";
import {
  type Book,
  type BookAuthor,
  type Author,
  type Publisher,
  type Language,
  type BookAuthorRole,
  type BookGenre,
  type Genre,
  type AuthorRole,
  type BookStarRating,
} from "~/server/db/schema";

import {
  getMissingFields,
  setInTableMap,
  getNumberFromAny,
  safeParseISBN,
  removeSpecialChars,
  getPublishDate,
  getFirstPublishDate,
  splitArrayIntoChunks,
} from "./getBookCSVData.helpers";
import { type BooksDataInserts, type CSVBook } from "./dataset.types";

const BOOKS_PATH = "./src/dataset/books.csv";

const CONFIG: Options = {
  mapHeaders: ({ header }) => header.trim(),
};

export function getBookCSVData(): Promise<BooksDataInserts> {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue("--- READING CSV BOOKS - START"));
    const columnsWithMissingMap = new Map<string, number>();

    const publishersMap = new Map<string, number>();
    const authorsMap = new Map<string, number>();
    const authorRolesMap = new Map<string, number>();
    const languagesMap = new Map<string, number>();
    const genresMap = new Map<string, number>();

    const booksData: Book[] = [];
    const bookAuthorsData: BookAuthor[] = [];
    const bookGenresData: BookGenre[] = [];
    const bookStarRatingsData: BookStarRating[] = [];
    const bookAuthorRolesData: BookAuthorRole[] = [];

    fs.createReadStream(BOOKS_PATH)
      .pipe(csv(CONFIG))
      .on("data", (book: CSVBook) => {
        //gathering data about missing fields in whole dataset
        getMissingFields(columnsWithMissingMap, book);

        if (
          !book.isbn ||
          !safeParseISBN(book.isbn).success ||
          !book.coverImg ||
          !book.price ||
          !book.title ||
          booksData.length >= 35000 //skipping booksData when there are already 35000 of them. In case of 'TRANSACTION_TIMEOUT' error, please decrease this value.
        ) {
          return;
        }
        const book_id = booksData.length;

        //------- languagesData --------
        const language = book.language;
        setInTableMap(languagesMap, language);

        //------- publishersData --------
        const publisher = book.publisher;
        setInTableMap(publishersMap, publisher);

        //------- bookStarRatingsData --------
        const starRatingsString = book.ratingsByStars;
        const starRatingsIDBefore = bookStarRatingsData.length; //using placeholder value to create id for elements

        if (starRatingsString) {
          try {
            //E.g book.genresData = ['3444695', '1921313', '745221', '171994', '93557'] - necessary to replace single quote to double quotes for parsing
            const starRatings = JSON.parse(starRatingsString.replaceAll(`'`, '"')) as string[];

            if (starRatings.length === 5) {
              //reversing starRatings, because they come in order from 5 to 1
              const bookRatings = starRatings.reverse().map((ratingsCount, i) => {
                const ratings_count = getNumberFromAny(ratingsCount);
                //checking for not, not for truthy, because 0 will throw an error
                if (ratings_count === null) {
                  throw `Failed to parse ratingsCount. Skipping ${book.isbn} bookRatings.`;
                }
                return {
                  id: starRatingsIDBefore + i,
                  book_id,
                  ratings_count,
                  star: i + 1,
                };
              });

              bookStarRatingsData.push(...bookRatings);
            }
          } catch (error) {
            console.log(error);
          }
        }

        //------- bookGenres --------
        if (book.genres) {
          try {
            //E.g book.genresData = "['Historical Fiction', 'Fiction']" - necessary to replace single quote to double quotes for parsing
            const genresData = JSON.parse(book.genres.replaceAll(`'`, '"')) as string[];

            if (genresData.length > 0) {
              genresData.forEach((genre, i) => {
                if (i >= 3) {
                  return;
                }
                //------- genresMap --------
                setInTableMap(genresMap, genre);
                bookGenresData.push({
                  id: bookGenresData.length,
                  book_id,
                  genre_id: genresMap.get(genre)!,
                });
              });
            }
          } catch (error) {
            console.log({ message: `Failed parsing genresData for ISBN: ${book.isbn}`, error });
          }
        }

        //------- bookAuthorsData and bookAuthorRole --------
        if (book.author) {
          //E.g. authorsWithMaybeRoles = ["Gal Anonim", " Brandon Graham (Writer, Artist)", " Anno (Translator)"]
          const authorsWithMaybeRoles = book.author.split(/,(?![^(]*\))/);

          for (const authorWithMaybeRole of authorsWithMaybeRoles) {
            //empty string - break loop
            if (!authorWithMaybeRole) {
              break;
            }

            //1 author can have many authorRolesData
            //E.g [author, maybeRoles] = ["Gal Anonim",  undefined] or ["Brandon Graham",  "Writer, Artist"]
            const [author, maybeRoles] = authorWithMaybeRole.split("(").map((e) => {
              return e.replace(")", "").trim();
            });

            if (!author) {
              break;
            }

            const book_author_id = bookAuthorsData.length;

            if (!authorsMap.has(author)) {
              authorsMap.set(author, authorsMap.size);
            }

            //------- bookAuthorsData --------
            bookAuthorsData.push({
              id: book_author_id,
              book_id,
              //! because author has already been set above
              author_id: authorsMap.get(author)!,
            });

            //checking if author has some special authorRolesData. If not, not inserting anything
            if (maybeRoles) {
              //E.g. authorRolesData = ["Writer", "Artist"]
              const authorRolesData = maybeRoles.split(",").map((e) => e.trim());

              for (const authorRole of authorRolesData) {
                if (!authorRole) {
                  break;
                }

                //adding authorRole to map if didn't occur yet
                setInTableMap(authorRolesMap, authorRole);

                //------- bookAuthorRolesData --------
                bookAuthorRolesData.push({
                  id: bookAuthorRolesData.length,
                  book_id,
                  book_author_id,
                  //! because author has already been set above
                  author_role_id: authorRolesMap.get(authorRole)!,
                });
              }
            }
          }
        }

        //------- publication_date Field --------
        //book.publish date can be in form 'August 1st 1988' or'06/01/88'
        let publication_date = null;
        if (book.publishDate?.includes("/")) {
          publication_date = getFirstPublishDate(book.publishDate);
        } else {
          publication_date = getPublishDate(book.publishDate);
        }

        //------- booksData --------
        /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
        const price = getNumberFromAny(book.price);
        if (!price || isNaN(price)) {
          return;
        }

        const transformedRow: Book = {
          id: book_id,
          title: book.title,
          isbn: book.isbn,
          ratings_count: getNumberFromAny(book.numRatings),
          publication_date,
          language_id: language && languagesMap.has(language) ? languagesMap.get(language)! : null,
          publisher_id: publisher && publishersMap.has(publisher) ? publishersMap.get(publisher)! : null,
          edition: book.edition || null,
          description: book.description ? removeSpecialChars(book.description) : null,
          average_rating: getNumberFromAny(book.rating),
          pages: getNumberFromAny(book.pages),
          price,
          liked_percent: getNumberFromAny(book.likedPercent),
          cover_url: book.coverImg,
        };
        /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */

        booksData.push(transformedRow);
      })
      .on("end", () => {
        console.log(chalk.green("\n--- READING CSV BOOKS - END\n"));

        const authorsData: Author[] = Array.from(authorsMap, (entry) => {
          return {
            id: entry[1],
            author: entry[0],
          };
        });

        const publishersData: Publisher[] = Array.from(publishersMap, (entry) => {
          return {
            id: entry[1],
            publisher: entry[0],
          };
        });

        const languagesData: Language[] = Array.from(languagesMap, (entry) => {
          return {
            id: entry[1],
            language: entry[0],
          };
        });

        const genresData: Genre[] = Array.from(genresMap, (entry) => {
          return {
            id: entry[1],
            genre: entry[0],
          };
        });

        const authorRolesData: AuthorRole[] = Array.from(authorRolesMap, (entry) => {
          return {
            id: entry[1],
            author_role: entry[0],
          };
        });

        resolve({
          authorsData: splitArrayIntoChunks(authorsData),
          bookAuthorsData: splitArrayIntoChunks(bookAuthorsData),
          booksData: splitArrayIntoChunks(booksData),
          languagesData: splitArrayIntoChunks(languagesData),
          publishersData: splitArrayIntoChunks(publishersData),
          genresData: splitArrayIntoChunks(genresData),
          authorRolesData: splitArrayIntoChunks(authorRolesData),
          bookAuthorRolesData: splitArrayIntoChunks(bookAuthorRolesData),
          bookGenresData: splitArrayIntoChunks(bookGenresData),
          bookStarRatingsData: splitArrayIntoChunks(bookStarRatingsData),
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
