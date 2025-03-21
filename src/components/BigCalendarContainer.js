"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import BigCalendar from "./BigCalendar";
// If you use a custom function to shift events into the current week, import it:
// import { adjustScheduleToCurrentWeek } from "@/lib/utils";

export default function BigCalendarContainer({ type, id }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);

      // Adjust the columns you want to select from your "events" table
      // e.g. "id, title, description, starttime, endtime, roomid, created_at"
      let query = supabase
        .from("events")
        .select("id, title, description, starttime, endtime, roomid, created_at");

      // Conditionally filter if you pass type="roomId" or type="staffId" in props
      // Only do this if your table actually has roomid or staffid columns
      if (type === "roomId" && id) {
        query = query.eq("roomid", id);
      } else if (type === "staffId" && id) {
        query = query.eq("staffid", id);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching events:", error.message);
        setSchedule([]);
      } else {
        // Map your event records into the format react-big-calendar expects
        const mapped = (data || []).map((event) => ({
          title: event.title,
          // optionally: desc: event.description,
          start: new Date(event.starttime),
          end: new Date(event.endtime),
        }));

        // If you have a function to shift events into the current calendar week:
        // const adjusted = adjustScheduleToCurrentWeek
        //   ? adjustScheduleToCurrentWeek(mapped)
        //   : mapped;

        setSchedule(mapped); // Or set to 'adjusted' if using a custom function
      }

      setLoading(false);
    }

    fetchEvents();
  }, [type, id]);

  if (loading) {
    return (
      <div className="bg-white p-4 shadow rounded-md">
        <p className="text-gray-600 text-sm">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 shadow rounded-md">
      <BigCalendar data={schedule} />
    </div>
  );
}
