import { STARTS_RATING_RANGE } from "~/server/db/schema";
import { BookTileStarIcons } from "./BookTileStarIcons";

export async function BookTileStars({ averageRating }: { averageRating: number | null }) {
  const ar = averageRating ? averageRating.toFixed(2) : undefined;
  const starsCount = ar ? Math.round(Number(averageRating)) : undefined;

  if (!starsCount) return null;
  return (
    <div id="stars" className="flex items-center gap-x-3">
      {starsCount ? <BookTileStarIcons count={starsCount} /> : null}
      <div className="flex items-center gap-x-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm tabular-nums">
        <p>{ar}</p>
        <p>/</p>
        <p>{STARTS_RATING_RANGE}</p>
      </div>
    </div>
  );
}
