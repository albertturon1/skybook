import { sql } from "drizzle-orm";
import { z } from "zod";
import { type BookTileProps } from "~/app/_components/BookTile";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

function formatDateMinusYears(x: number): string {
  const currentDate = new Date();
  const newDate = new Date(currentDate.getFullYear() - x, currentDate.getMonth(), currentDate.getDate());

  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
  const day = newDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const bookRouter = createTRPCRouter({
  getRecommendedBooks: publicProcedure.input(z.number()).query(async ({ input }) => {
    const maxPublicationDate = formatDateMinusYears(15);

    const booksData = await db.query.books.findMany({
      orderBy: sql`RANDOM()`,
      limit: input,
      with: {
        bookAuthors: {
          with: {
            authors: {
              columns: {
                author: true,
              },
            },
          },
        },
      },
      where: (books, { gte, and }) =>
        and(
          gte(books.average_rating, 4.5),
          gte(books.ratings_count, 1000),
          gte(books.publication_date, maxPublicationDate),
        ),
    });

    return booksData.map((book) => {
      const { bookAuthors, cover_url, average_rating, edition, isbn, price, title } = book;
      const authors = bookAuthors.map((ba) => ba.authors.author);

      return { authors, coverUrl: cover_url, averageRating: average_rating, edition, isbn, price, title };
    }) satisfies BookTileProps[];
  }),
  getAllTimeGreat: publicProcedure.input(z.number()).query(async ({ input }) => {
    const booksData = await db.query.books.findMany({
      orderBy: (books, { desc }) => [desc(books.average_rating)],
      limit: input,
      with: {
        bookAuthors: {
          with: {
            authors: {
              columns: {
                author: true,
              },
            },
          },
        },
      },
      where: (books, { gte, and }) => and(gte(books.ratings_count, 1000000)),
    });

    return booksData.map((book) => {
      const { bookAuthors, cover_url, average_rating, edition, isbn, price, title } = book;
      const authors = bookAuthors.map((ba) => ba.authors.author);

      return { authors, coverUrl: cover_url, averageRating: average_rating, edition, isbn, price, title };
    }) satisfies BookTileProps[];
  }),
});
