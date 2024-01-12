import { PageLayout } from "~/app/_components/ui/PageLayout";
import { api } from "~/trpc/server";

export type GenrePageProps = { params: { genreID: string } };

export default async function Genre({ params: { genreID } }: GenrePageProps) {
  // const book = await api.book.getBook.query(genre);

  // //TODO: add handling empty state
  // if (!book) return null;
  return <PageLayout>{genreID}</PageLayout>;
}
