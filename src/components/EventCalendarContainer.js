"use client";

import React from "react";
import Image from "next/image";
import EventCalendar from "./EventCalendar";
import EventListPage from "@/app/dashboard/list/events/page";

export default function EventCalendarContainer({ searchParams }) {
  // Expect searchParams to contain a "date" parameter (e.g. from the URL)
  const { date } = searchParams || {};

  return (
    <div className="bg-white p-4 rounded-md">
      <EventCalendar />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="More Options" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        <EventListPage dateParam={date} />
      </div>
    </div>
  );
}
