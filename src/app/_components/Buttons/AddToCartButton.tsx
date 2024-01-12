"use client";

type AddToCartButtonProps = {
  isbn: string;
};

export function AddToCartButton({ isbn }: AddToCartButtonProps) {
  function handleAddToCart() {
    alert(isbn);
  }

  return (
    <button onClick={handleAddToCart} className="flex max-w-[500px] items-center justify-center bg-orange-500 py-3">
      <h1>Add to cart</h1>
    </button>
  );
}
