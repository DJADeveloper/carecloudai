// src/components/UserCard.jsx
"use client";

import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";

const UserCard = ({ type }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      let result;
      // For "resident", use the residents table; for others, use the users table.
      if (type === "resident") {
        result = await supabase
          .from("residents")
          .select("*", { count: "exact", head: true });
      } else {
        // Assume type is provided in lower-case and convert to uppercase for role
        const role = type.toUpperCase();
        result = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("role", role);
      }
      if (result.error) {
        console.error(`Error fetching count for ${type}:`, result.error.message);
      } else {
        setCount(result.count || 0);
      }
    }
    fetchCount();
  }, [type]);

  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <FiMoreVertical size={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{count}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
    </div>
  );
};

export default UserCard;
