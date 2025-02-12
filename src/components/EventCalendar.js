"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function EventCalendar() {
  const [value, setValue] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    // Update the URL query parameter with the selected date (formatted as YYYY-MM-DD)
    if (value instanceof Date) {
      router.push(`?date=${value.toISOString().split("T")[0]}`);
    }
  }, [value, router]);

  return <Calendar onChange={setValue} value={value} />;
}
