"use client";

type AddToCartButtonProps = {
  isbn: string;
};

export function AddToCartButton({ isbn }: AddToCartButtonProps) {
  function handleAddToCart() {
    alert(isbn);
  }

  return (
    <button
      onClick={handleAddToCart}
      className="flex w-full max-w-[480px] items-center justify-center bg-orange-500 py-3 lg:max-w-[550px]"
    >
      <h1 className="font-semibold text-white">Add to cart</h1>
    </button>
  );
}
