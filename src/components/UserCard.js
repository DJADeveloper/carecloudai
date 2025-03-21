"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

/**
 * A simpler UserCard that fetches a single count from one specified table.
 * Example usage: <UserCard label="Residents" table="residents" />
 *
 * If you need multiple queries (e.g., staff with role=ADMIN, or a 'family' table),
 * either create more specialized components or pass a query filter.
 */
export default function UserCard({ label, table, filter = {} }) {
  const [count, setCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchCount() {
      // Start building the query for 'head: true' (metadata only) with 'count: exact'
      let query = supabase.from(table).select("*", { count: "exact", head: true });

      // If a filter object is provided, apply it
      // e.g., filter = { role: "ADMIN" }
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { error, count: c } = await query;
      if (error) {
        setErrorMsg(error.message);
        console.error(`Error fetching count for table '${table}':`, error.message);
      } else {
        setCount(c || 0);
      }
    }

    fetchCount();
  }, [table, filter]);

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center justify-center min-w-[150px]">
      {errorMsg ? (
        <p className="text-red-500 text-sm">{errorMsg}</p>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-gray-800">{count}</h1>
          <p className="text-sm text-gray-500">{label} Count</p>
        </>
      )}
    </div>
  );
}
