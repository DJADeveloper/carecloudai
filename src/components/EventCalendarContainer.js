"use client";

import React from "react";
import Image from "next/image";
import EventCalendar from "./EventCalendar";
import EventListPage from "@/app/dashboard/list/events/page";

export default function EventCalendarContainer({ searchParams }) {
  // Expect searchParams to contain a "date" parameter (e.g., ?date=YYYY-MM-DD)
  const { date } = searchParams || {};

  return (
    <div className="bg-white p-4 shadow rounded-md">
      {/* Calendar */}
      <EventCalendar />

      {/* Heading row with optional "more" icon */}
      {/* <div className="flex items-center justify-between mt-4 mb-2">
        <h1 className="text-lg font-semibold text-gray-800">Events</h1>
        <button
          type="button"
          className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="More Options"
        >
          <Image src="/moreDark.png" alt="More Options" width={20} height={20} />
        </button>
      </div> */}

      {/* Event List */}
      {/* <div className="flex flex-col gap-4">
        <EventListPage dateParam={date} />
      </div> */}
    </div>
  );
}
