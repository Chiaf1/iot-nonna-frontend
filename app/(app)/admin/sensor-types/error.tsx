// React usa ErrorBoundry per intercettare gli errori, la pagina error.tsx riceve due props:
// error e reset
// dove reset é una funzione da collegare ad un tasto interattivo quindi error.tsc deve per forza essere client
"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="py-20 text-center">
      <h2 className="text-lg font-semibold text-neutral-800">
        Qualcosa é andato storto
      </h2>
      <p className="mt-2 test-sm text-neutral-500">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
      >
        Riprova
      </button>
    </div>
  );
}
