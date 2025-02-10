// src/app/dashboard/family/page.js
"use client";
// import Announcements from "@/components/Announcements";
// import BigCalendarContainer from "@/components/BigCalendarContainer";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";


export default function FamilyPage() {
  const { user, loading: authLoading } = useCurrentUser();
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResidents() {
      if (user) {
        // Assuming your residents table has a column named "familyid" (lower-case)
        const { data, error } = await supabase
          .from("residents")
          .select("*")
          .eq("familyid", user.id);
        if (error) {
          console.error("Error fetching residents:", error.message);
        } else {
          setResidents(data);
        }
      }
      setLoading(false);
    }
    fetchResidents();
  }, [user]);

  if (authLoading || loading) return <div>Loading...</div>;

  return (
    
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {residents.length > 0 ? (
          residents.map((resident) => (
            <div className="h-full bg-white p-4 rounded-md" key={resident.id}>
              <h1 className="text-xl font-semibold">
                Schedule ({resident.fullname || resident.fullName})
              </h1>
              {/* <BigCalendarContainer type="roomId" id={resident.roomid || resident.roomId} /> */}
            </div>
          ))
        ) : (
          <p>No residents found for your family account.</p>
        )}
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        {/* <Announcements /> */}
      </div>
    </div>
    
  );
}
