import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-4xl font-bold tracking-tight">
        Admin Dashboard
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md text-center">
        Manage your documents, Q&A pairs, and view analytics.
      </p>
      <Link
        href="/admin"
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
