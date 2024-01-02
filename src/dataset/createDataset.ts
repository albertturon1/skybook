import { getBookCSVData } from "./getBookCSVData";
import { insertDataIntoDB } from "./insertIntoDB";

export async function createDataset() {
  const data = await getBookCSVData();
  await insertDataIntoDB(data);
}
