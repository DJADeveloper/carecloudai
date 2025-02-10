// src/components/CountChartContainer.jsx
"use client";

import { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import CountChart from "./CountChart"; 
import { supabase } from "@/app/lib/supabase";

const CountChartContainer = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResidents() {
      // Fetch only the careLevel field for all residents
      const { data, error } = await supabase
        .from("residents")
        .select("careLevel");
      if (error) {
        console.error("Error fetching residents:", error.message);
      } else {
        setResidents(data || []);
      }
      setLoading(false);
    }
    fetchResidents();
  }, []);

  // Calculate counts by care level (adjust casing if needed)
  const low = residents.filter(
    (r) => r.carelevel && r.carelevel.toUpperCase() === "LOW"
  ).length;
  const medium = residents.filter(
    (r) => r.carelevel && r.carelevel.toUpperCase() === "MEDIUM"
  ).length;
  const high = residents.filter(
    (r) => r.carelevel && r.carelevel.toUpperCase() === "HIGH"
  ).length;
  const total = low + medium + high;

  if (loading) return <div>Loading chart...</div>;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Residents by Care Level</h1>
        <FiMoreVertical size={20} />
      </div>
      {/* CHART */}
      <CountChart low={low} medium={medium} high={high} />
      {/* BOTTOM SUMMARY */}
      <div className="flex justify-center gap-16 mt-4">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{low}</h1>
          <h2 className="text-xs text-gray-300">
            Low ({total > 0 ? Math.round((low / total) * 100) : 0}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{medium}</h1>
          <h2 className="text-xs text-gray-300">
            Medium ({total > 0 ? Math.round((medium / total) * 100) : 0}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-red-400 rounded-full" />
          <h1 className="font-bold">{high}</h1>
          <h2 className="text-xs text-gray-300">
            High ({total > 0 ? Math.round((high / total) * 100) : 0}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
