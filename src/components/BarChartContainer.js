"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { FiMoreVertical } from "react-icons/fi";
import BarChartComponent from "./BarChartComponent";

const BarChartContainer = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResidents() {
      const { data, error } = await supabase.from("residents").select("carelevel");
      if (error) {
        console.error("Error fetching residents:", error.message);
      } else {
        setResidents(data || []);
      }
      setLoading(false);
    }
    fetchResidents();
  }, []);

  // Aggregate care levels
  const low = residents.filter((r) => r.carelevel?.toUpperCase() === "LOW").length;
  const medium = residents.filter((r) => r.carelevel?.toUpperCase() === "MEDIUM").length;
  const high = residents.filter((r) => r.carelevel?.toUpperCase() === "HIGH").length;
  const total = low + medium + high;

  // Format data for Recharts
  const chartData = [{ name: "Residents", low, medium, high }];

  if (loading) return <div>Loading chart...</div>;

  return (
    <div className="w-full bg-white rounded-xl shadow p-4 flex flex-col">
      {/* Top bar: title + menu icon */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Residents Overview</h1>
        <FiMoreVertical className="text-gray-400" size={20} />
      </div>

      {/* The bar chart */}
      <div className="flex-1">
        <BarChartComponent data={chartData} />
      </div>

      {/* Bottom legend / summary */}
      <div className="flex justify-center gap-10 mt-4">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-[#C3EBFA] rounded-full" />
          <h1 className="font-semibold text-gray-700">{low}</h1>
          <h2 className="text-xs text-gray-400">
            Low ({total > 0 ? Math.round((low / total) * 100) : 0}%)
          </h2>
        </div>

        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-[#FAE27C] rounded-full" />
          <h1 className="font-semibold text-gray-700">{medium}</h1>
          <h2 className="text-xs text-gray-400">
            Medium ({total > 0 ? Math.round((medium / total) * 100) : 0}%)
          </h2>
        </div>

        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-[#FCA5A5] rounded-full" />
          <h1 className="font-semibold text-gray-700">{high}</h1>
          <h2 className="text-xs text-gray-400">
            High ({total > 0 ? Math.round((high / total) * 100) : 0}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default BarChartContainer;
