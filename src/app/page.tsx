import Image from "next/image";

import book from "~/../public/book-orange.webp";

export default async function Home() {
  return (
    <main className="mx-auto flex flex-col lg:container">
      <div className="flex bg-green-300 sm:flex-row md:max-h-[600px] md:space-x-4">
        <div id="left-side" className="flex flex-1 flex-col justify-between  px-3 py-6 md:space-y-16 md:px-0 md:pl-6">
          <h1 className="font-display text-5xl font-black leading-snug lg:text-6xl lg:leading-normal">
            The best platform to learn secrets of books.
          </h1>
          <p className="font-display text-lg">Borrow or buy thousands of ebooks without an effort.</p>
        </div>
        <Image alt="Header image" src={book} className="hidden w-[50%] flex-1 bg-cover sm:flex" />
      </div>
    </main>
  );
}
