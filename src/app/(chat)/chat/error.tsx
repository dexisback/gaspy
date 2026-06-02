"use client";

import { useEffect } from "react";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Chat error:", error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-white px-6">
      <h2 className="text-base font-semibold text-[#171916]">
        Something went wrong
      </h2>
      <p className="text-sm text-gray-500 text-center max-w-xs">
        The chat encountered an unexpected error. Try refreshing the page.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-[#171916] px-5 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
