import { insertDataIntoDB } from "./insertIntoDB";
import { getBookCSVData } from "./getBookCSVData";
import { getBookImagesMap } from "./getBookImagesMap";

export async function createDataset() {
  const bookImagesMap = await getBookImagesMap();
  const data = await getBookCSVData(bookImagesMap);
  await insertDataIntoDB(data);
}