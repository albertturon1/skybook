export type BookPageProps = { params: { isbn: string } };

export default async function Book({ params }: BookPageProps) {
  return <h1>{`book ${params.isbn}`}</h1>;
}
