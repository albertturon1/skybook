"use client";

export function MangeSessionButton({ onPress, title }: { onPress: () => void; title: string }) {
  return (
    <button onClick={onPress} className="rounded-xl border-2 border-blue-400 px-5  py-3">
      <h1 className="font-display text-sm uppercase">{title}</h1>
    </button>
  );
}
