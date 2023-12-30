import { z } from "zod";
import { type SafeParse } from "~/utils/typescriptHelpers";
import { type CSVBook } from "./dataset.types";

export function replaceWhiteSpacesToSingle<T extends string>(str: T) {
  return str.replace(/\s+/g, " ");
}

const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{1,4}$/;

//setting ISBN as required to have for a book
type CSVBookSchema = z.ZodType<CSVBook & Required<Pick<CSVBook, "isbn">>>;

export const csvBookSchema: CSVBookSchema = z.object({
  bookID: z.string().refine((value) => typeof Number(value) === "number", {
    message: "bookID should be a numerical string",
  }),
  title: z
    .string({
      required_error: "title should be a string",
    })
    .transform((value) => replaceWhiteSpacesToSingle(value.trim())),
  isbn: z
    .string()
    .refine((value) => safeParseISBN(value).success, {
      message: "Invalid ISBN code for isbn",
    })
    .transform((value) => replaceWhiteSpacesToSingle(value.trim())),
  isbn13: z
    .string()
    .optional()
    .refine((value) => !value || safeParseISBN(value).success, {
      message: "Invalid ISBN code for isbn13",
    }),
  language_code: z
    .string()
    .optional()
    .refine((value) => !value || /^[a-zA-Z\-]+$/.test(value), {
      message: "Invalid format for language_code",
    })
    .transform((value) => (value ? replaceWhiteSpacesToSingle(value.trim()) : value)),
  average_rating: z
    .string()
    .optional()
    .refine((value) => typeof Number(value) === "number", {
      message: "average_rating should be a numerical string",
    }),
  num_pages: z
    .string()
    .optional()
    .refine((value) => typeof Number(value), {
      message: "num_pages should be a numerical string",
    }),
  ratings_count: z
    .string()
    .optional()
    .refine((value) => typeof Number(value), {
      message: "ratings_count should be a numerical string",
    }),
  text_reviews_count: z
    .string()
    .optional()
    .refine((value) => typeof Number(value), {
      message: "text_reviews_count should be a numerical string",
    }),
  publication_date: z
    .string()
    .optional()
    .refine((value) => !value || dateRegex.test(value), {
      message: "Invalid date format for publication_date",
    })
    .transform((value) => (value ? replaceWhiteSpacesToSingle(value.trim()) : value)),
  authors: z
    .string()
    .optional()
    .transform((value) => (value ? replaceWhiteSpacesToSingle(value.trim()) : value)),
  publisher: z
    .string()
    .optional()
    .transform((value) => (value ? replaceWhiteSpacesToSingle(value.trim()) : value)),
});

//https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch04s13.html
// `regex` checks for ISBN-10 or ISBN-13 format
const regex =
  /^(?:ISBN(?:-1[03])?:? )?(?=[-0-9 ]{17}$|[-0-9X ]{13}$|[0-9X]{10}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?(?:[0-9]+[- ]?){2}[0-9X]$/;

function safeParseISBN<const T extends string>(subject: T): SafeParse<T, { message: string }[]> {
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
