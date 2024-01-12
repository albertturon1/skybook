import Image from "next/image";
import Link from "next/link";
import { BookTileStars } from "~/app/_components/BookTile/BookTileStars";
import { AddToCartButton } from "~/app/_components/Buttons/AddToCartButton";
import { PageLayout } from "~/app/_components/ui/PageLayout";
import { api } from "~/trpc/server";

export type BookPageProps = { params: { isbn: string } };

export default async function Book({ params: { isbn } }: BookPageProps) {
  const book = await api.book.getBook.query(isbn);

  //TODO: add handling empty state
  if (!book) return null;
  return (
    <PageLayout>
      <section className="flex gap-x-10 pt-20">
        <div id="cover" className="h-max bg-gray-200 p-1.5">
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

          <div id="author" className="flex items-center gap-x-2 text-xl text-gray-700">
            <h1>by</h1>
            <div className="flex items-center gap-x-2">
              {book.authors.map(({ author, id }, i) => (
                <div key={id} className="flex items-center">
                  <Link href={`/author/${id}`} className="underline underline-offset-2">
                    {author}
                  </Link>
                  {i !== book.authors.length - 1 ? <p>,</p> : null}
                </div>
              ))}
            </div>
          </div>

          <h1 id="price" className="text-2xl font-semibold">
            {`${book.price} USD`}
          </h1>

          <AddToCartButton isbn={book.isbn} />

          <BookTileStars averageRating={book.averageRating} size="medium" />

          {book.ratingsCount ? (
            <h1 id="reviewCount" className="text-sm tabular-nums">
              {`${book.ratingsCount.toLocaleString()} ratings`}
            </h1>
          ) : null}

          <h1 id="description" className="max-w-[500px] text-sm leading-relaxed">
            {book.description}
          </h1>

          <div id="genres" className="flex items-center gap-x-4">
            <h1>Genres</h1>
            <div className="flex items-center gap-x-3 text-sm font-light">
              {book.genres.map(({ genre, id }) => (
                <Link href={`/genre/${id}`} key={genre} className="underline underline-offset-2">
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
