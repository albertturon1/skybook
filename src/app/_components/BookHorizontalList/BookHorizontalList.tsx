import { BookTile, type BookTileProps } from "../BookTile";

export type BookHorizontalListProps = {
  recommendedBooks: BookTileProps[];
  title: string;
};

export async function BookHorizontalList({ recommendedBooks, title }: BookHorizontalListProps) {
  if (recommendedBooks.length === 0) return null;

  return (
    <div className="my-12 flex flex-1 flex-col items-center gap-y-10">
      <h1 className="text-2xl font-medium underline decoration-green-300 underline-offset-8">{title}</h1>
      <div className="mx-auto grid w-full max-w-max grid-cols-2 gap-6 gap-y-10 px-4 sm:grid-cols-4">
        {recommendedBooks.map((book) => (
          <BookTile key={book.isbn} {...book} />
        ))}
      </div>
    </div>
  );
}
