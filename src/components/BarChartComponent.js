"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const BarChartComponent = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fill: "#718096", fontSize: 12 }} />
          <YAxis tick={{ fill: "#718096", fontSize: 12 }} />
          <Tooltip cursor={{ fill: "rgba(156, 163, 175, 0.1)" }} />
          <Legend />
          <Bar dataKey="low" fill="#C3EBFA" radius={[4, 4, 0, 0]} />
          <Bar dataKey="medium" fill="#FAE27C" radius={[4, 4, 0, 0]} />
          <Bar dataKey="high" fill="#FCA5A5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
