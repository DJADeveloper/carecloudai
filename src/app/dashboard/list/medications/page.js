"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { useSearchParams } from "next/navigation";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { FaFilter, FaSort, FaEye, FaPills } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function MedicationListPage() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("admin");
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1");
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    setRole("admin");
  }, []);

  useEffect(() => {
    async function fetchMedications() {
      setLoading(true);
      let query = supabase
        .from("medications")
        .select("id, medication_name, dosage, schedule, administered_at, status, notes", { count: "exact" });
      
      if (searchTerm) {
        query = query.ilike("medication_name", `%${searchTerm}%`);
      }
      
      const start = (pageParam - 1) * ITEM_PER_PAGE;
      const end = start + ITEM_PER_PAGE - 1;
      query = query.range(start, end);

      const { data: fetchedData, error, count: fetchedCount } = await query;
      if (error) {
        console.error("Error fetching medications:", error.message);
        setData([]);
        setCount(0);
      } else {
        setData(fetchedData || []);
        setCount(fetchedCount || 0);
      }
      setLoading(false);
    }
    fetchMedications();
  }, [pageParam, searchTerm]);

  const columns = [
    { header: "Medication", accessor: "medication_name" },
    { header: "Dosage", accessor: "dosage", className: "hidden md:table-cell" },
    {
      header: "Schedule",
      accessor: "schedule",
      className: "hidden md:table-cell",
      // Format the schedule date/time if needed
    },
    {
      header: "Status",
      accessor: "status",
      className: "hidden md:table-cell",
    },
    { header: "Notes", accessor: "notes", className: "hidden lg:table-cell" },
    ...(role === "admin"
      ? [{ header: "Actions", accessor: "action" }]
      : []),
  ];

  const renderRow = (item) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="p-4">{item.medication_name}</td>
      <td className="hidden md:table-cell">{item.dosage}</td>
      <td className="hidden md:table-cell">
        {item.schedule ? new Date(item.schedule).toLocaleString() : "N/A"}
      </td>
      <td className="hidden md:table-cell">{item.status}</td>
      <td className="hidden lg:table-cell">{item.notes || "-"}</td>
      {role === "admin" && (
        <td className="p-4">
          <div className="flex items-center gap-2">
            <Link href={`/list/medications/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                <FaEye className="text-white" />
              </button>
            </Link>
            <FormContainer table="medication" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  if (loading) return <div className="p-4">Loading Medications...</div>;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Medications</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <FaFilter size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <FaSort size={14} />
            </button>
            {role === "admin" && <FormContainer table="medication" type="create" />}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={pageParam} count={count} />
      <FormModal />
    </div>
  );
}
