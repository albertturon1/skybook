To generate DB_AUTH_TOKEN:

```bash
turso db tokens create skybook
```

To get token to authenticate you to Turso platform API:

```bash
turso db tokens create
```

### Inserting data to db

Try inserting values one by one. There are problems when trying to insert multiple values at once E.g. value([1000 row]) won't let you pass, do loops around the array.

You can use drizzle db, because it gives you autocompletion and minimum type safety - with tursoClient.batch you need pass pure SQL statements and it's unsafe.

If you need order when reading data with fs.createReadSteam use `new Promsise` so you will be able to block reading of selected files.

Parse row with zod instead of using type guards - it's safer.

### Issues with different approaches when INSERTing

```ts
//this is not working, returns HTTP STATUS 400
await db.batch([
  db.insert(books).values(books),
  db.insert(authors).values(authors),
  db.insert(bookAuthors).values(bookAuthors),
  db.insert(languages).values(languages),
  db.insert(publishers).values(publishers),
  db.insert(bookCoverTable).values(bookImages),
]);
```

```ts
//Also not working, returns HTTP STATUS 400
await db.transaction(async (tx) => {
  await tx.insert(books).values(books);
  await tx.insert(authors).values(authors);
  await tx.insert(bookAuthors).values(bookAuthors);
  await tx.insert(publishers).values(publishers);
  await tx.insert(bookCoverTable).values(bookImages);
  await tx.insert(languages).values(languages);
});
```

```ts
function splitArrayIntoChunks<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

//Inserts table that have not foreign key. Nesting transactions doesn't fix the issue with foreign keys
//LibsqlError: SQLITE_UNKNOWN: SQLite error: no such table: main.__old_push_publisher
await db.transaction(async (tx) => {
  //------- publishers --------
  splitArrayIntoChunks(publishers, CHUNK_SIZE).forEach(async (chunk) => {
    await tx.insert(publishers).values(chunk);
  });

  //------- authors --------
  splitArrayIntoChunks(authors, CHUNK_SIZE).forEach(async (chunk) => {
    await tx.insert(authors).values(chunk);
  });

  //------- languages --------
  splitArrayIntoChunks(languages, CHUNK_SIZE).forEach(async (chunk) => {
    await tx.insert(languages).values(chunk);
  });

  await tx.transaction(async (tx2) => {
    //------- books --------
    splitArrayIntoChunks(books, CHUNK_SIZE).forEach(async (chunk) => {
      await tx2.insert(books).values(chunk);
    });

    await tx.transaction(async (tx3) => {
      //------- bookAuthors --------
      splitArrayIntoChunks(bookAuthors, CHUNK_SIZE).forEach(async (chunk) => {
        await tx3.insert(bookAuthors).values(chunk);
      });

      //------- bookCoverTable --------
      splitArrayIntoChunks(bookImages, CHUNK_SIZE).forEach(async (chunk) => {
        await tx3.insert(bookCoverTable).values(chunk);
      });
    });
  });
});
```

##### placing Map in {} in console.log({}) will print empty {}

##### empty string and ?? vs ||

```ts
const nullValue = null;
const emptyText = ""; // falsy
const someNumber = 42;

const valA = nullValue ?? "default for A";
const valB = emptyText ?? "default for B";
const valC = someNumber ?? 0;

console.log(valA); // "default for A"
console.log(valB); // "" (as the empty string is not null or undefined)
```

# Auth

`next-auth/react` provides easy integration with major OAuth providers like Google.
But sometimes it force constraints like database table column names. For example, **email_verified** in **users** table throw errors, but changing it to **email_verified**.

### NODE_ENV

Setting NODE_ENV before a block of scripts works only on the first one.
E.g.
`"NODE_ENV=production bun db-generate && bun db-migrate && tsx src/dataset"` worked only on bun db-generate, don't know why was that.
