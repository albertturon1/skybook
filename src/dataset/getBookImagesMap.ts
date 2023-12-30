import fs from "fs";
import csv from "csv-parser";
import chalk from "chalk";
import { BookImageSize } from "~/server/db/schema";
import { type BookWithImage } from "./dataset.types";
import { type BookImageMapItem } from "./createDatasets.types";

const BOOKS_WITH_IMAGES_PATH = "./src/dataset/books_with_images.csv";

/**
 * @returns Map collection of ISBN as a key with array of images as value
 */
export function getBookImagesMap(): Promise<Map<string, BookImageMapItem[]>> {
  return new Promise((resolve, reject) => {
    type BookImageMapItem = { size: BookImageSize; url: string };
    const bookImagesMap = new Map<string, BookImageMapItem[]>();

    console.log(chalk.blue("--- READING CSV BOOK IMAGES - START ---"));

    fs.createReadStream(BOOKS_WITH_IMAGES_PATH)
      .pipe(csv({ separator: ";" }))
      .on("data", (row: BookWithImage) => {
        const small = row["Image-URL-S"];
        const medium = row["Image-URL-M"];
        const large = row["Image-URL-L"];

        const isbn = row.ISBN;

        // Check if there is already an array for the given ID in the map
        if (!bookImagesMap.has(isbn)) {
          // If it doesn't exist, create a new array with the new item and set it in the map
          bookImagesMap.set(isbn, []);
        }

        // If it exists, push the new item to the existing array
        if (small) {
          bookImagesMap.get(isbn)?.push({ size: BookImageSize.small, url: small });
        }

        if (medium) {
          bookImagesMap.get(isbn)?.push({ size: BookImageSize.medium, url: medium });
        }

        if (large) {
          bookImagesMap.get(isbn)?.push({ size: BookImageSize.large, url: large });
        }
      })
      .on("end", () => {
        console.log(chalk.green("--- READING CSV BOOK IMAGES - END ---\n"));
        resolve(bookImagesMap);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
