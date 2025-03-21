"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
// Icons
import { FaFilter, FaSort, FaEye } from "react-icons/fa";
import Link from "next/link";

export default function EventListPage() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  // For demo, role is hardcoded; in production, use your auth hook or session check
  const [role, setRole] = useState("admin");

  // Query parameters from URL
  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    // Hardcode or fetch from your user session
    setRole("admin");
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);

      // Adjust columns to match your 'events' table. 
      // For example: "id, title, description, starttime, endtime, roomid, created_at"
      // Omit columns you don't need to display
      let query = supabase
        .from("events")
        .select("id, title, description, starttime, endtime, roomid, created_at", {
          count: "exact",
        });

      // Search by title if there's a search term
      if (searchTerm) {
        query = query.ilike("title", `%${searchTerm}%`);
      }

      // Pagination
      const start = (pageParam - 1) * ITEM_PER_PAGE;
      const end = start + ITEM_PER_PAGE - 1;
      query = query.range(start, end);

      const { data: fetchedData, error, count: fetchedCount } = await query;
      if (error) {
        console.error("Error fetching events:", error.message);
        setData([]);
        setCount(0);
      } else {
        setData(fetchedData || []);
        setCount(fetchedCount || 0);
      }
      setLoading(false);
    }

    fetchEvents();
  }, [pageParam, searchTerm]);

  // Define table columns
  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Description", accessor: "description", className: "hidden md:table-cell" },
    {
      header: "Start Time",
      accessor: "starttime",
      className: "hidden md:table-cell",
    },
    {
      header: "End Time",
      accessor: "endtime",
      className: "hidden md:table-cell",
    },
    // Optional: if you want to display the room or created time
    // { header: "Room", accessor: "roomid", className: "hidden lg:table-cell" },
    // { header: "Created At", accessor: "created_at", className: "hidden lg:table-cell" },

    // If admin, show actions column
    ...(role === "admin"
      ? [{ header: "Actions", accessor: "action" }]
      : []),
  ];

  // Render each row
  const renderRow = (item) => {
    // Format date/time
    const startFormatted = new Date(item.starttime).toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });
    const endFormatted = new Date(item.endtime).toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="p-4">{item.title}</td>
        <td className="hidden md:table-cell">{item.description || "-"}</td>
        <td className="hidden md:table-cell">{startFormatted}</td>
        <td className="hidden md:table-cell">{endFormatted}</td>

        {/* If you'd like to show roomid or created_at, do so here
        <td className="hidden lg:table-cell">{item.roomid || "None"}</td>
        <td className="hidden lg:table-cell">
          {new Date(item.created_at).toLocaleString("en-US")}
        </td>
        */}

        {role === "admin" && (
          <td className="p-4">
            <div className="flex items-center gap-2">
              {/* View button, linking to a detail page (if it exists) */}
              <Link href={`/list/events/${item.id}`}>
                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                  <FaEye className="text-white" />
                </button>
              </Link>
              {/* Delete button using your FormContainer approach */}
              <FormContainer table="event" type="delete" id={item.id} />
            </div>
          </td>
        )}
      </tr>
    );
  };

  if (loading) return <div className="p-4">Loading Events...</div>;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <FaFilter size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <FaSort size={14} />
            </button>
            {role === "admin" && (
              // Add an event
              <FormContainer table="event" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* Use your generic Table component */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <Pagination page={pageParam} count={count} />

      {/* If you have a global FormModal for create/update forms */}
      <FormModal />
    </div>
  );
}
