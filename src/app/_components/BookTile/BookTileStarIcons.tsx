import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import StarOutlined from "public/star-outlined.png";
import StarFilled from "public/star-filled.png";
import { STARTS_RATING_RANGE } from "~/server/db/schema";

export async function BookTileStarIcons({ count }: { count: number }) {
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
          />
        );
      })}
    </div>
  );
}
