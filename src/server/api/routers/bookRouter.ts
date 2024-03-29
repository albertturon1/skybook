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
      columns: {
        coverUrl: true,
        averageRating: true,
        edition: true,
        isbn: true,
        price: true,
        title: true,
      },
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
          gte(books.averageRating, 4.5),
          gte(books.ratingsCount, 1000),
          gte(books.publicationDate, maxPublicationDate),
        ),
    });

    return booksData.map((book) => {
      const authors = book.bookAuthors.map((ba) => ba.authors.author);

      return Object.assign(book, { authors });
    }) satisfies BookTileProps[];
  }),
  getAllTimeGreat: publicProcedure.input(z.number()).query(async ({ input }) => {
    const booksData = await db.query.books.findMany({
      orderBy: (books, { desc }) => [desc(books.averageRating)],
      limit: input,
      columns: {
        coverUrl: true,
        averageRating: true,
        edition: true,
        isbn: true,
        price: true,
        title: true,
      },
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
      where: (books, { gte, and }) => and(gte(books.ratingsCount, 1000000)),
    });

    return booksData.map((book) => {
      const authors = book.bookAuthors.map((ba) => ba.authors.author);

      return { authors, ...book };
    }) satisfies BookTileProps[];
  }),
  getBook: publicProcedure.input(z.string().min(10)).query(async ({ input }) => {
    const bookData = await db.query.books.findFirst({
      with: {
        bookAuthors: {
          with: {
            authors: {
              columns: {
                author: true,
                id: true,
              },
            },
          },
        },
        bookGenres: {
          with: {
            genres: {
              columns: {
                genre: true,
                id: true,
              },
            },
          },
        },
      },
      where: (books, { eq }) => eq(books.isbn, input),
    });

    if (!bookData) return;

    const authors = bookData.bookAuthors.map((ba) => ba.authors);
    const genres = bookData.bookGenres.map((ba) => ba.genres);
    return Object.assign(bookData, { authors, genres });
  }),
});
