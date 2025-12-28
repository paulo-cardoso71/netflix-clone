'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white gap-6">
      <h2 className="text-3xl font-bold text-red-600">Something went wrong!</h2>
      <p className="text-zinc-400">We couldn't load the movies. Please try again.</p>
      
      <button
        onClick={() => reset()} // Tenta recarregar a página
        className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-neutral-300 transition"
      >
        Try Again
      </button>
    </div>
  );
}