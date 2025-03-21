"use client";

import React, { useState, useEffect } from "react";
import UserCard from "@/components/UserCard";
import CountChartContainer from "@/components/CountChartContainer";
import BarChartContainer from "@/components/BarChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import { FiMoreVertical } from "react-icons/fi";
import AlertsBanner from "@/components/AlertsBanner";
import TodoList from "@/components/TodoList";

export default function StaffDashboard({ searchParams }) {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Alerts */}
      <AlertsBanner />

      {/* Assigned Residents & Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Assigned Residents</h2>
          <CountChartContainer />
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h2>
            <QuickActions />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">To-Do List</h2>
            <TodoList />
          </div>
        </div>
      </div>

      {/* Daily / Weekly Schedule */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">My Schedule</h2>
        <EventCalendarContainer searchParams={searchParams} />
      </div>

      {/* Trends & Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Resident Trends</h2>
          <CountChartContainer />
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Care Task Analysis</h2>
          <BarChartContainer />
        </div>
      </div>

      {/* Communication & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h2>
          <RecentActivity />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Upcoming Events</h2>
          <EventCalendarContainer searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}
