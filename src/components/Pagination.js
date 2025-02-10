"use client";

import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { useRouter } from "next/navigation";

export default function Pagination({ page, count }) {
  const router = useRouter();

  // Determine if there is a previous page
  const hasPrev = page > 1;
  // Calculate if there's a next page based on the count and ITEM_PER_PAGE
  const hasNext = page < Math.ceil(count / ITEM_PER_PAGE);

  // Function to update the page parameter in the URL
  const changePage = (newPage) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={!hasPrev}
        onClick={() => changePage(page - 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from({ length: Math.ceil(count / ITEM_PER_PAGE) }, (_, index) => {
          const pageIndex = index + 1;
          return (
            <button
              key={pageIndex}
              onClick={() => changePage(pageIndex)}
              className={`px-2 rounded-sm ${
                page === pageIndex ? "bg-lamaSky text-white" : "bg-transparent"
              }`}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>
      <button
        disabled={!hasNext}
        onClick={() => changePage(page + 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
