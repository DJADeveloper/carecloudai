"use client";

import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function BigCalendar({ data }) {
  const [view, setView] = useState(Views.WORK_WEEK);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="h-[70vh]">
      <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        views={["work_week", "day"]}
        view={view}
        onView={handleViewChange}
        style={{ height: "100%" }}
        // Example limiting the times to 8 AM - 5 PM
        min={new Date(2025, 1, 0, 8, 0, 0)}
        max={new Date(2025, 1, 0, 17, 0, 0)}
      />
    </div>
  );
}
