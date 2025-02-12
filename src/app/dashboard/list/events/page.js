"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import FormContainer from "@/components/FormContainer";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { FaFilter, FaSort, FaEye } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import FormModal from "@/components/FormModal";

export default function EventListPage() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  // For demo purposes, role is hardcoded; replace with your auth hook if needed.
  const [role, setRole] = useState("admin");
  const searchParams = useSearchParams();

  // Retrieve query parameters from URL
  const pageParam = parseInt(searchParams.get("page") || "1");
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    setRole("admin");
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      let query = supabase
        .from("events")
        .select("id, title, description, starttime, endtime", { count: "exact" });

      if (searchTerm) {
        query = query.ilike("title", `%${searchTerm}%`);
      }

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

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Description", accessor: "description", className: "hidden md:table-cell" },
    {
      header: "Start Time",
      accessor: "starttime",
      className: "hidden md:table-cell",
      // You could further format the date/time in the renderRow
    },
    {
      header: "End Time",
      accessor: "endtime",
      className: "hidden md:table-cell",
    },
    ...(role === "admin"
      ? [{ header: "Actions", accessor: "action" }]
      : []),
  ];

  const renderRow = (item) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="p-4">{item.title}</td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td className="hidden md:table-cell">
        {new Date(item.starttime).toLocaleDateString("en-US")}{" "}
        {new Date(item.starttime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </td>
      <td className="hidden md:table-cell">
        {new Date(item.endtime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </td>
      {role === "admin" && (
        <td className="p-4">
          <div className="flex items-center gap-2">
            <Link href={`/list/events/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                <FaEye className="text-white" />
              </button>
            </Link>
            <FormContainer table="event" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  if (loading) return <div className="p-4">Loading Events...</div>;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="event" type="create" />}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={pageParam} count={count} />
      <FormModal />
    </div>
  );
}
