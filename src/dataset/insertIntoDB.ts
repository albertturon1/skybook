import chalk from "chalk";
import {
  authors,
  publishers,
  languages,
  books,
  bookAuthors,
  authorRoles,
  bookAuthorRoles,
  genres,
  bookGenres,
} from "~/server/db/schema";
import { db } from "~/server/db";
import { type BooksDataInserts } from "./dataset.types";

/**
 *
 * @param data Properties aggregated from books.csv and books_with_images.csv
 * @description Function that inserts data into database
 */
export async function insertDataIntoDB(data: BooksDataInserts) {
  const {
    booksData,
    bookAuthorsData,
    authorsData,
    publishersData,
    languagesData,
    authorRolesData,
    bookAuthorRolesData,
    genresData,
    bookGenresData,
  } = data;

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

    authorsData.forEach(async (e) => {
      await tx.insert(authors).values(e);
    });

    publishersData.forEach(async (e) => {
      await tx.insert(publishers).values(e);
    });

    languagesData.forEach(async (e) => {
      await tx.insert(languages).values(e);
    });

    genresData.forEach(async (e) => {
      await tx.insert(genres).values(e);
    });

    authorRolesData.forEach(async (e) => {
      await tx.insert(authorRoles).values(e);
    });

    booksData.forEach(async (e) => {
      await tx.insert(books).values(e);
    });

    bookAuthorsData.forEach(async (e) => {
      await tx.insert(bookAuthors).values(e);
    });

    bookAuthorRolesData.forEach(async (e) => {
      await tx.insert(bookAuthorRoles).values(e);
    });

    bookGenresData.forEach(async (e) => {
      await tx.insert(bookGenres).values(e);
    });
  });

  console.log(chalk.green("--- INSERTING - END\n"));
  process.exit();
}
