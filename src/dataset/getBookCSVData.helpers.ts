import { type CSVBook } from "./dataset.types";
import { type SafeParse } from "~/utils/typescriptHelpers";

export function getNumberFromAny<T>(input: T) {
  const toNumber = Number(input);
  if (isNaN(toNumber)) return null;

  return toNumber;
}

export function getMissingFields(columnsWithMissingMap: Map<string, number>, book: CSVBook) {
  Object.entries(book).forEach(([key, value]) => {
    // Collect columns with missing values (undefined or null)
    if (!value) {
      if (!columnsWithMissingMap.has(key)) {
        columnsWithMissingMap.set(key, 0);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        columnsWithMissingMap.set(key, columnsWithMissingMap.get(key) + 1);
      }
    }
  });
}

export function setInTableMap(map: Map<string, number>, value: string | undefined) {
  if (value && !map.has(value)) {
    map.set(value, map.size);
  }
}

//https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch04s13.html
// `regex` checks for ISBN-10 or ISBN-13 format
const regex =
  /^(?:ISBN(?:-1[03])?:? )?(?=[-0-9 ]{17}$|[-0-9X ]{13}$|[0-9X]{10}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?(?:[0-9]+[- ]?){2}[0-9X]$/;

export function safeParseISBN<const T extends string>(subject: T): SafeParse<T, { message: string }[]> {
  if (!regex.test(subject)) {
    return {
      success: false,
      errors: [{ message: "Invalid ISBN" }],
    };
  }

  // Remove non ISBN digits, then split into an array
  const chars = subject.replace(/[^0-9X]/g, "").split("");
  // Remove the final ISBN digit from `chars`, and assign it to `last`
  const last = chars.pop();
  let sum = 0;
  let digit = 10;
  let check;

  if (chars.length == 9) {
    // Compute the ISBN-10 check digit
    for (const char of chars) {
      sum += digit * parseInt(char, 10);
      digit -= 1;
    }
    check = 11 - (sum % 11);
    if (check == 10) {
      check = "X";
    } else if (check == 11) {
      check = "0";
    }
  } else {
    // Compute the ISBN-13 check digit
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (!char) {
        break;
      }
      sum += ((i % 2) * 2 + 1) * parseInt(char, 10);
    }
    check = 10 - (sum % 10);
    if (check == 10) {
      check = "0";
    }
  }

  if (check != last) {
    return {
      success: false,
      errors: [{ message: "Invalid ISBN - check digit" }],
    };
  }
  return {
    success: true,
    data: subject,
  };
}

export function removeSpecialChars(inputString: string): string {
  return inputString.replace(/(\r\n|\n|\r)/gm, "");
}

const monthMap: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

export function getPublishDate(input: string | undefined): string | null {
  if (!input) return null;

  const dateArray = input.split(" ");

  if (!dateArray || dateArray.length !== 3) return null;
  const [monthAsString, dayWithSuffix, yearAsString] = dateArray;

  if (!monthAsString || !dayWithSuffix || !yearAsString) return null;

  const month = monthMap[monthAsString];
  const day = parseInt(dayWithSuffix, 10);
  const year = Number(yearAsString);

  if (!month) return null;

  const result = `${year}-${month + 1}-${day}`;

  //check if result is a valid date
  if (isNaN(new Date(result).getTime())) return null;

  return result;
}

export function getFirstPublishDate(date: string | undefined) {
  const isValidDate = date && date.includes("/") && date.split("/").length === 3;
  if (!isValidDate) return null;

  const [year, month, day] = date.split("/");
  if (!year || !month || !day) return null;

  const newYear = Number(year) > 24 ? `19${year}` : `20${year}`;
  return `${newYear}-${month}-${day}`;
}

export function splitArrayIntoChunks<T>(array: T[], chunkSize = 100): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
}
