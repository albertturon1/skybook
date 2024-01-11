import Image from "next/image";
import { BookTileStars } from "~/app/_components/BookTile/BookTileStars";
import { PageLayout } from "~/app/_components/ui/PageLayout";
import { api } from "~/trpc/server";

export type BookPageProps = { params: { isbn: string } };

export default async function Book({ params: { isbn } }: BookPageProps) {
  const book = await api.book.getBook.query(isbn);

  //TODO: add handling empty state
  if (!book) return null;
  return (
    <PageLayout>
      <section className="flex gap-x-10">
        <div id="cover" className="bg-gray-200 p-1">
          <Image
            alt="Header image"
            src={book.coverUrl}
            className="hidden w-full flex-1 bg-cover object-cover sm:flex sm:w-[240px]"
            width="300"
            height="500"
          />
        </div>
        <div className="flex flex-1 flex-col gap-y-4">
          <h1 id="title" className="text-3xl font-semibold">
            {book.title}
          </h1>
          <h1 id="author" className="text-xl text-gray-700">
            {`by ${book.authors.join(", ")}`}
          </h1>
          <BookTileStars averageRating={book.averageRating} size="medium" />
        </div>
      </section>
    </PageLayout>
  );
}
