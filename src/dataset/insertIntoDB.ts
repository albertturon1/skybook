import chalk from "chalk";
import {
  authorTable,
  publisherTable,
  languageCodeTable,
  bookTable,
  bookCoverTable,
  bookAuthorTable,
} from "~/server/db/schema";
import { type BooksDataInserts } from "./generateDatasets.types";
import { db } from "~/server/db";

/**
 *
 * @param data Properties aggregated from books.csv and books_with_images.csv
 * @description Function that inserts data into database
 */
export async function insertDataIntoDB(data: BooksDataInserts) {
  const { books, bookAuthors, authors, publishers, languageCodes, bookImages } = data;

  await db.transaction(async (tx) => {
    try {
      console.log(
        chalk.blue(
          "--- INSERTING:\n- author\n- publisher\n- languageCode\n- bookAuthor\n- books\n- bookCover\n\n--- BEGIN",
        ),
      );

      authors.forEach(async (e) => {
        await tx.insert(authorTable).values(e);
      });

      publishers.forEach(async (e) => {
        await tx.insert(publisherTable).values(e);
      });
      languageCodes.forEach(async (e) => {
        await tx.insert(languageCodeTable).values(e);
      });

      books.forEach(async (e) => {
        await tx.insert(bookTable).values(e);
      });

      bookImages.forEach(async (e) => {
        await tx.insert(bookCoverTable).values(e);
      });
      bookAuthors.forEach(async (e) => {
        await tx.insert(bookAuthorTable).values(e);
      });

      console.log(chalk.green("--- INSERTING - END\n"));
    } catch (e) {
      tx.rollback();
      throw e;
    }
  });

  process.exit();
}
