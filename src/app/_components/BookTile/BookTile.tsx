import Image from "next/image";
import Link from "next/link";
import { BookTileStars } from "./BookTileStars";
// import { AddToCartButton } from "../Buttons/AddToCartButton";

export type BookTileProps = {
  title: string;
  isbn: string;
  edition: string | null;
  price: number;
  averageRating: number | null;
  coverUrl: string;
  authors: string[];
};

export async function BookTile({ authors, isbn, title, coverUrl, averageRating, price }: BookTileProps) {
  const authorsText = authors.join(", ");

  return (
    <div className="flex w-full max-w-[200px] flex-1 flex-col overflow-hidden">
      <Link href={`/book/${isbn}`} className="mx-auto h-full">
        <Image
          className="h-[240px] max-h-full w-auto bg-cover object-contain md:h-[280px]"
          src={coverUrl}
          alt={`Cover for ${title}`}
          width="0"
          height="0"
          sizes="100vw"
          quality={75}
        />
      </Link>
      <div id="texts" className="mb-4 mt-6 flex flex-col gap-y-1.5 pl-1.5">
        <h1 className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">{title}</h1>
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">{authorsText}</p>
        <BookTileStars averageRating={averageRating} />
        <p id="price" className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold tabular-nums">
          {Number(price.toString()).toFixed(2)} USD
        </p>
      </div>
      {/* <AddToCartButton isbn={isbn} /> */}
    </div>
  );
}
