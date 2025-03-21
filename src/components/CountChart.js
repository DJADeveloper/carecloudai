"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const CountChart = ({ low, medium, high }) => {
  // Build up the chart data from the props
  const data = [
    {
      name: "Low",
      count: low,
      fill: "#C3EBFA",   // Example color for "Low"
    },
    {
      name: "Medium",
      count: medium,
      fill: "#FAE27C",   // Example color for "Medium"
    },
    {
      name: "High",
      count: high,
      fill: "#FCA5A5",   // Example color for "High" (light red)
    },
  ];

  return (
    <div className="relative w-full h-[75%]">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={32}
          data={data}
        >
          <RadialBar background dataKey="count" />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* 
        If you want an icon in the center, place it here. 
        Otherwise, remove this block entirely. For example:
      
        <Image
          src="/someCenterIcon.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      */}
    </div>
  );
};

export default CountChart;
