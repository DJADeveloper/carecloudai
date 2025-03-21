"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { FaFilter, FaSort, FaEye, FaUser } from "react-icons/fa";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

export default function StaffListPage() {
  const [data, setData] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  // For demonstration, we hardcode role as "admin" (update with your auth hook as needed)
  const [role, setRole] = React.useState("admin");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse query parameters (page and search)
  const pageParam = parseInt(searchParams.get("page") || "1");
  const searchTerm = searchParams.get("search") || "";

  React.useEffect(() => {
    // In production, retrieve user role from your auth hook instead.
    setRole("admin");
  }, []);

  React.useEffect(() => {
    async function fetchStaff() {
      setLoading(true);
      // Build the query: fetch all staff records with a count.
      let queryBuilder = supabase
        .from("staff")
        .select("*", { count: "exact" });
      
      if (searchTerm) {
        queryBuilder = queryBuilder.ilike("name", `%${searchTerm}%`);
      }
      
      const start = (pageParam - 1) * ITEM_PER_PAGE;
      const end = start + ITEM_PER_PAGE - 1;
      queryBuilder = queryBuilder.range(start, end);

      const { data: fetchedData, error, count: fetchedCount } = await queryBuilder;
      if (error) {
        console.error("Error fetching staff:", error.message);
        setData([]);
        setCount(0);
      } else {
        setData(fetchedData || []);
        setCount(fetchedCount || 0);
      }
      setLoading(false);
    }
    fetchStaff();
  }, [pageParam, searchTerm]);

  // Define table columns
  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Surname",
      accessor: "surname",
    },
    {
      header: "Email",
      accessor: "email",
      className: "hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Role",
      accessor: "role",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  // Render each row: make the row clickable so that it navigates to the staff profile.
  const renderRow = (staff) => (
    <tr
      key={staff.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight cursor-pointer"
      onClick={() => router.push(`/dashboard/list/staffs/${staff.id}`)}
    >
      <td className="p-4">{staff.name}</td>
      <td className="p-4 hidden md:table-cell">{staff.surname}</td>
      <td className="p-4 hidden md:table-cell">{staff.email}</td>
      <td className="p-4 hidden lg:table-cell">{staff.phone}</td>
      <td className="p-4 hidden lg:table-cell">{staff.role}</td>
      {role === "admin" && (
        <td className="p-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <Link href={`/list/staff/${staff.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                <FaEye className="text-white" />
              </button>
            </Link>
            <FormContainer table="staff" type="delete" id={staff.id} />
          </div>
        </td>
      )}
    </tr>
  );

  if (loading) return <div className="p-4">Loading Staff...</div>;

  return (
    
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top bar: search and filter controls */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Staff</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow text-gray-700">
              <FaFilter size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow text-gray-700">
              <FaSort size={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="staff" type="create" />
            )}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={pageParam} count={count} />
    </div>
  );
}
