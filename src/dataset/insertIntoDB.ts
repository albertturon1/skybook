import chalk from "chalk";
import {
  authorTable,
  publisherTable,
  languageTable,
  bookTable,
  bookAuthorTable,
  authorRoleTable,
  bookAuthorRoleTable,
  genreTable,
  bookGenreTable,
} from "~/server/db/schema";
import { db } from "~/server/db";
import { type BooksDataInserts } from "./dataset.types";

/**
 *
 * @param data Properties aggregated from books.csv and books_with_images.csv
 * @description Function that inserts data into database
 */
export async function insertDataIntoDB(data: BooksDataInserts) {
  const { books, bookAuthors, authors, publishers, languages, authorRoles, bookAuthorRoles, genres, bookGenres } = data;

  try {
    for (const key in data) {
      const ids: number[] = data[key as keyof typeof data].map((e) => e.id);

      if (ids.length === 0) {
        throw chalk.red(`ERROR: ${key} is empty. Fix it before trying to insert data into db.`);
      }

      const hasDuplicates = new Set(ids).size !== ids.length;

      if (hasDuplicates) {
        throw chalk.red(`ERROR: ${key} has duplicated id's. Fix it before trying to insert data into db.`);
      }
    }
  } catch (error) {
    console.log(error);
    process.exit();
  }

  await db.transaction(async (tx) => {
    console.log(
      chalk.blue("--- INSERTING:\n- author\n- publisher\n- language\n- bookAuthor\n- books\n- bookCover\n\n--- BEGIN"),
    );

    authors.forEach(async (e) => {
      await tx.insert(authorTable).values(e);
    });

    publishers.forEach(async (e) => {
      await tx.insert(publisherTable).values(e);
    });

    languages.forEach(async (e) => {
      await tx.insert(languageTable).values(e);
    });

    genres.forEach(async (e) => {
      await tx.insert(genreTable).values(e);
    });

    authorRoles.forEach(async (e) => {
      await tx.insert(authorRoleTable).values(e);
    });

    books.forEach(async (e) => {
      await tx.insert(bookTable).values(e);
    });

    bookAuthors.forEach(async (e) => {
      await tx.insert(bookAuthorTable).values(e);
    });

    bookAuthorRoles.forEach(async (e) => {
      await tx.insert(bookAuthorRoleTable).values(e);
    });

    bookGenres.forEach(async (e) => {
      await tx.insert(bookGenreTable).values(e);
    });
  });

  console.log(chalk.green("--- INSERTING - END\n"));
  process.exit();
}
