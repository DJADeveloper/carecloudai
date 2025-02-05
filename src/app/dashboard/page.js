// src/app/dashboard/page.js
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // adjust path as needed
import Link from "next/link";

export default function Dashboard() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResidents() {
      const { data, error } = await supabase.from("residents").select("*");
      console.log(data, 'data')
      if (error) console.error("Error fetching residents:", error.message);
      else setResidents(data);
      setLoading(false);
    }
    fetchResidents();
    console.log(residents);
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Dashboard</h1>
      <Link href="/">Back to Home</Link>
      <hr />
      {loading ? (
        <p>Loading residents...</p>
      ) : (
        <>
          {residents.length > 0 ? (
            <ul>
              {residents.map((resident) => (
                <li key={resident.id}>
                  {resident.fullname} - {resident.carelevel}
                </li>
              ))}
            </ul>
          ) : (
            <p>No residents found.</p>
          )}
        </>
      )}
    </div>
  );
}
