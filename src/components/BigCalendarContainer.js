"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import BigCalendar from "./BigCalendar";
import { adjustScheduleToCurrentWeek } from "@/lib/utils"; // Ensure this exists or remove if not needed

export default function BigCalendarContainer({ type, id }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchedules() {
      setLoading(true);
      let query = supabase
        .from("events")
        .select("id, title, starttime, endtime");
      if (type === "staffId") {
        query = query.eq("staffid", id);
      } else if (type === "roomId") {
        query = query.eq("roomid", id);
      }
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching schedules:", error.message);
        setSchedule([]);
      } else {
        const mapped = data.map((event) => ({
          title: event.title,
          start: new Date(event.starttime),
          end: new Date(event.endtime),
        }));
        // Optionally adjust schedule to the current week
        const adjusted = adjustScheduleToCurrentWeek(mapped);
        setSchedule(adjusted);
      }
      setLoading(false);
    }
    fetchSchedules();
  }, [type, id]);

  if (loading) return <div>Loading calendar...</div>;

  return (
    <div className="bg-white p-4 rounded-md">
      <BigCalendar data={schedule} />
    </div>
  );
}
