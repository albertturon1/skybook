"use client";

type AddToCartButtonProps = {
  isbn: string;
};

export function AddToCartButton({ isbn }: AddToCartButtonProps) {
  function handleAddToCart() {
    alert(isbn);
  }

  return (
    <button onClick={handleAddToCart} className="flex items-center justify-center bg-blue-800 p-5">
      <h1>Add to cart</h1>
    </button>
  );
}
