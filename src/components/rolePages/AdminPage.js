"use client";

import React, { useState, useEffect } from "react";
import UserCard from "@/components/UserCard";
import CountChartContainer from "@/components/CountChartContainer";
import ResidentListPage from "@/app/dashboard/list/residents/page";
import EventCalendarContainer from "../EventCalendarContainer";
import FormContainer from "@/components/FormContainer";
import { FiMoreVertical, FiX } from "react-icons/fi";
import QuickActions from "../QuickActions";
import BarChartContainer from "../BarChartContainer";
import AlertsBanner from "../AlertsBanner";
import RecentActivity from "../RecentActivity";
import TodoList from '@/components/TodoList'
import { useCurrentUser } from "@/context/UserContext";

export default function AdminPage({ searchParams }) {
  const { user, dbData, refreshData } = useCurrentUser();

  // Use refreshData when you need to refresh all data
  const handleDataUpdate = async () => {
    await refreshData();
  };

//   const allowedUserCards = ["Admin", "staff", "resident", "family"];
//   function capitalizeFirst(word) {
//     if (!word) return "";
//     return word.charAt(0).toUpperCase() + word.slice(1);
//   }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Row 1: Alerts */}
      <AlertsBanner />

      {/* Row 2: Count Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {allowedUserCards.map((role) => (
          <div
            key={role}
            className="bg-white p-4 rounded shadow flex flex-col items-center"
          >
            <UserCard label={capitalizeFirst(role)} table={role} />
          </div>
        ))}
      </div> */}

      {/* Row 3: Trends & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 2/3 for Trends */}
        <div className="md:col-span-2 bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Trends & Analytics
          </h2>
          <div className="min-h-[300px] flex items-center justify-center">
            <CountChartContainer />
          </div>
          <div className="min-h-[300px] min-w-[300px] flex items-center justify-center">
            <BarChartContainer />
          </div>
        </div>
        {/* 1/3 for Quick Actions */}
        <div className="bg-white rounded shadow p-4 md:col-span-1 justify-center">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Quick Actions
          </h2>
          <QuickActions />
        </div>
      </div>

      {/* Row 4: Residents List */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Residents List
        </h2>
        <ResidentListPage />
      </div>

      {/* Row 5: Recent Activity & Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <div>
          <RecentActivity />
        </div> */}
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Upcoming Events
          </h2>
          <EventCalendarContainer searchParams={searchParams} />
        </div>
      </div>

      {/* Tasks section */}
      <div className="mt-8">
        <TodoList />
      </div>
    </div>
  );
}
