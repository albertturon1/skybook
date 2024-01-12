import { STARTS_RATING_RANGE } from "~/server/db/schema";
import { BookTileStarIcons } from "./BookTileStarIcons";

export type BookTileStarsKey = "small" | "medium" | "large";

const BOOK_TILE_STARS_TEXT_SIZE = {
  small: "text-sm",
  medium: "text-[0.9rem] leading-[1rem]",
  large: "text-base",
} as const satisfies Record<BookTileStarsKey, string>;

export type BookTileStarsProps = { averageRating: number | null; size?: BookTileStarsKey };

export async function BookTileStars({ averageRating, size = "medium" }: BookTileStarsProps) {
  const ar = averageRating ? averageRating.toFixed(2) : undefined;
  const starsCount = ar ? Math.round(Number(averageRating)) : undefined;

  if (!starsCount) return null;
  return (
    <div id="stars" className="flex items-center gap-x-3">
      {starsCount ? <BookTileStarIcons count={starsCount} size={size} /> : null}
      <div
        className={`flex items-center gap-x-0.5 overflow-hidden text-ellipsis whitespace-nowrap pt-0.5 tabular-nums ${BOOK_TILE_STARS_TEXT_SIZE[size]}`}
      >
        <p>{ar}</p>
        <p>/</p>
        <p>{STARTS_RATING_RANGE}</p>
      </div>
    </div>
  );
}
