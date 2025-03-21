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
import { FaFilter, FaSort, FaEye } from "react-icons/fa";
import Link from "next/link";

export default function IncidentListPage() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  // Hardcode role to admin for demonstration; update with your actual auth hook.
  const [role, setRole] = useState("admin");

  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    // For demonstration, set to admin
    setRole("admin");
  }, []);

  useEffect(() => {
    async function fetchIncidents() {
      setLoading(true);

      // Example join: If you have a `staffid` foreign key in `incidents` 
      // and want to fetch staff's name from the staff table, 
      // you can define a relationship in Supabase or select it directly:
      // .select("id, incident_type, description, incident_date, resolved, resolution_notes, created_at, staff ( name )", { count: "exact" })
      // Adjust the staff relationship name if you’ve set up 
      // a foreign key with a custom relation name.

      let query = supabase
        .from("incidents")
        .select(
          `
          id,
          incident_type,
          description,
          incident_date,
          resolved,
          resolution_notes,
          created_at,
          staff (
            name
          )
        `,
          { count: "exact" }
        );

      // If searching by incident_type, you can also do an ilike on description, etc.
      if (searchTerm) {
        query = query.ilike("incident_type", `%${searchTerm}%`);
      }

      // Pagination
      const start = (pageParam - 1) * ITEM_PER_PAGE;
      const end = start + ITEM_PER_PAGE - 1;
      query = query.range(start, end);

      const { data: fetchedData, error, count: fetchedCount } = await query;
      if (error) {
        console.error("Error fetching incidents:", error.message);
        setData([]);
        setCount(0);
      } else {
        setData(fetchedData || []);
        setCount(fetchedCount || 0);
      }
      setLoading(false);
    }
    fetchIncidents();
  }, [pageParam, searchTerm]);

  // Now define columns, including staff name and created_at
  const columns = [
    { header: "Type", accessor: "incident_type" },
    { header: "Description", accessor: "description", className: "hidden md:table-cell" },
    {
      header: "Date",
      accessor: "incident_date",
      className: "hidden md:table-cell",
    },
    {
      header: "Created At",
      accessor: "created_at",
      className: "hidden md:table-cell",
    },
    {
      header: "Logged By",
      accessor: "staffName", // We'll map staff.name to this accessor in `renderRow`
      className: "hidden lg:table-cell",
    },
    {
      header: "Resolved",
      accessor: "resolved",
      className: "hidden md:table-cell",
    },
    {
      header: "Notes",
      accessor: "resolution_notes",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin"
      ? [{ header: "Actions", accessor: "action" }]
      : []),
  ];

  const renderRow = (item) => {
    const incidentDate = new Date(item.incident_date).toLocaleDateString("en-US");
    const createdAt = new Date(item.created_at).toLocaleString();
    const staffName = item.staff ? item.staff.name : "N/A";

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="p-4">{item.incident_type}</td>
        <td className="hidden md:table-cell">{item.description}</td>
        <td className="hidden md:table-cell">{incidentDate}</td>
        <td className="hidden md:table-cell">{createdAt}</td>
        <td className="hidden lg:table-cell">{staffName}</td>
        <td className="hidden md:table-cell">{item.resolved ? "Yes" : "No"}</td>
        <td className="hidden lg:table-cell">{item.resolution_notes || "-"}</td>

        {role === "admin" && (
          <td className="p-4">
            <div className="flex items-center gap-2">
              <Link href={`/list/incidents/${item.id}`}>
                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                  <FaEye className="text-white" />
                </button>
              </Link>
              <FormContainer table="incident" type="delete" id={item.id} />
            </div>
          </td>
        )}
      </tr>
    );
  };

  if (loading) {
    return <div className="p-4">Loading Incidents...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Incidents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <FaFilter size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <FaSort size={14} />
            </button>
            {role === "admin" && <FormContainer table="incident" type="create" />}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={pageParam} count={count} />
      <FormModal />
    </div>
  );
}
