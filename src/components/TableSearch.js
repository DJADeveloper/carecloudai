"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TableSearch() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = e.currentTarget[0].value;

    // Create a URLSearchParams object from the current query string.
    const params = new URLSearchParams(window.location.search);
    params.set("search", value);

    // Push a new URL with the updated query parameters.
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-1 ring-gray-300 px-2"
    >
      <Image src="/search.png" alt="Search Icon" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </form>
  );
}
