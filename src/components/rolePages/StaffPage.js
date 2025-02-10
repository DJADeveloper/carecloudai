// src/app/dashboard/staff/page.js
"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";


// import Announcements from "@/components/Announcements";
// import BigCalendarContainer from "@/components/BigCalendarContainer";


export default function StaffPage() {
  const { user, loading } = useCurrentUser();
  
  if (loading) return <div>Loading...</div>;
  const userId = user ? user.id : null;

  return (
    
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Staff Schedule</h1>
          {/* <BigCalendarContainer type="staffId" id={userId} /> */}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        {/* <Announcements /> */}
      </div>
    </div>
    
  );
}
