"use client";

import React, { useState, useEffect } from "react";
import UserCard from "@/components/UserCard";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import RecentActivity from "@/components/RecentActivity";
import { FiMoreVertical } from "react-icons/fi";
import AlertsBanner from "@/components/AlertsBanner";
import ChatWithUsers from "../Chat";

export default function FamilyDashboard({ searchParams }) {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Alerts */}
      <AlertsBanner />

      {/* Resident Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">My Loved Ones</h2>
          <UserCard type="resident" />
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Facility Updates</h2>
          <RecentActivity />
        </div>
      </div>

      {/* Upcoming Events & Schedule */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Upcoming Visits & Events</h2>
        <EventCalendarContainer searchParams={searchParams} />
      </div>

      {/* Document Center */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Resident Care Documents</h2>
        <p className="text-sm text-gray-500">Access medical updates, care plans, and shared files.</p>
        {/* Placeholder for document list */}
        <ul className="mt-2 space-y-2">
          <li className="text-sm text-blue-500 cursor-pointer hover:underline">Care Plan - John Doe.pdf</li>
          <li className="text-sm text-blue-500 cursor-pointer hover:underline">Medication Schedule.pdf</li>
        </ul>
      </div>

      {/* Communication */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h2>
          <RecentActivity />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Messages</h2>
          <p className="text-sm text-gray-500">Chat with staff or administration about your loved one’s care.</p>
          {/* Placeholder for message interface */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-700">
            No new messages.
            {/* <ChatWithUsers /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
