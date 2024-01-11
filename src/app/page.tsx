import Image from "next/image";
import bookImage from "~/../public/book-orange.webp";
import { api } from "~/trpc/server";
import { unstable_cache } from "next/cache";
import { BookHorizontalList } from "./_components/BookHorizontalList";
import { hoursToSeconds } from "~/utils/misc";

const LIMIT = 4;

const getCachedRecommendedBooks = unstable_cache(
  async () => await api.book.getRecommendedBooks.query(LIMIT),
  [`getCachedRecommendedBooks-${LIMIT}`],
  {
    revalidate: hoursToSeconds(1),
  },
);

const getCachedAllTimeGreatBooks = unstable_cache(
  async () => await api.book.getAllTimeGreat.query(LIMIT),
  [`getCachedRecommendedBooks-${LIMIT}`],
  {
    revalidate: hoursToSeconds(24),
  },
);

export default async function Home() {
  const recommendedBooks = await getCachedRecommendedBooks();
  const allTimeGreatBooks = await getCachedAllTimeGreatBooks();

  return (
    <main className="mx-auto flex flex-col lg:container">
      <div className="mb-10 flex max-h-[600px] bg-green-300 sm:flex-row md:space-x-4">
        <div id="left-side" className="flex flex-1 flex-col justify-between  px-3 py-6 md:space-y-16 md:px-0 md:pl-6">
          <h1 className="font-display py-3 text-5xl font-black leading-snug sm:py-6 md:py-10 lg:text-6xl lg:leading-normal">
            The best platform to learn secrets of books.
          </h1>
          <p className="font-display text-lg">Borrow or buy thousands of ebooks without an effort.</p>
        </div>
        <Image alt="Header image" src={bookImage} className="hidden w-[50%] flex-1 bg-cover object-cover sm:flex" />
      </div>
      <BookHorizontalList recommendedBooks={recommendedBooks} title="Recommended books" />
      <BookHorizontalList recommendedBooks={allTimeGreatBooks} title="All time great" />
    </main>
  );
}
