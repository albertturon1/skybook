import { PageLayout } from "~/app/_components/ui/PageLayout";
import { api } from "~/trpc/server";

export type GenrePageProps = { params: { id: string } };

export default async function Genre({ params: { id } }: GenrePageProps) {
  // const book = await api.book.getBook.query(genre);

  // //TODO: add handling empty state
  // if (!book) return null;
  return <PageLayout>{`AuthorID: ${id}`}</PageLayout>;
}
