// src/app/dashboard/admin/page.js
"use client";

import React from "react";
import UserCard from "@/components/UserCard";
import CountChartContainer from "@/components/CountChartContainer"; // assume available
import ResidentListPage from "@/app/dashboard/list/residents/page";
import EventCalendarContainer from "../EventCalendarContainer";

export default function AdminPage({ searchParams }) {
  const allowedUserCards = ["admin", "staff", "resident", "family"];

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT COLUMN */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex flex-wrap gap-4 justify-between">
          {allowedUserCards.map((role) => (
            <UserCard key={role} type={role} />
          ))}
        </div>

        {/* Resident List Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Residents List</h2>
          <ResidentListPage />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/3 h-[450px]">
            {/* <CountChartContainer /> */}
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            {/* Placeholder for future components */}
          </div>
        </div>

        {/* BOTTOM CHART (e.g., FinanceChart placeholder) */}
        <div className="w-full h-[500px]">
          {/* Future FinanceChart component */}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        {/* Optionally include event calendar or announcements */}
        <EventCalendarContainer searchParams={searchParams} />
      </div>
    </div>
  );
}
