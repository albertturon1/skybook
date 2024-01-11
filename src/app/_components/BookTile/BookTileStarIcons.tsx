import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import StarOutlined from "public/star-outlined.png";
import StarFilled from "public/star-filled.png";
import { STARTS_RATING_RANGE } from "~/server/db/schema";
import { type BookTileStarsKey } from "./BookTileStars";

export const BOOK_TILE_STAR_ICONS_SIZE = {
  small: 16,
  medium: 24,
  large: 32,
} as const satisfies Record<BookTileStarsKey, number>;

export type BookTileStarIconsProps = { count: number; size: BookTileStarsKey };

export async function BookTileStarIcons({ count, size }: BookTileStarIconsProps) {
  const iconSize = BOOK_TILE_STAR_ICONS_SIZE[size];

  return (
    <div className="flex gap-x-1">
      {Array.from(Array(STARTS_RATING_RANGE).keys()).map((k, i) => {
        const isOutlined = i + 1 > count;

        return (
          <Image
            key={k}
            src={(isOutlined ? StarOutlined : StarFilled) as StaticImport}
            alt="Rating star"
            className="w-3"
            style={{
              height: iconSize,
              width: iconSize,
            }}
          />
        );
      })}
    </div>
  );
}
