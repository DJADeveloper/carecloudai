"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import FormContainer from "@/components/FormContainer";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { FaFilter, FaSort, FaEye, FaUserAlt } from "react-icons/fa";
import FormModal from "@/components/FormModal";
import Navbar from "@/components/Navbar";

export default function ResidentListPage() {
  const [data, setData] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [role, setRole] = React.useState("guest");
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1");
  const searchTerm = searchParams.get("search") || "";

  React.useEffect(() => {
    setRole("admin"); 
  }, []);

  React.useEffect(() => {
    async function fetchResidents() {
      setLoading(true);
      let queryBuilder = supabase
        .from("residents")
        .select(
          `
            id,
            fullname,
            phone,
            address,
            carelevel,
            dateofbirth,
            img,
            bloodtype
          `,
          { count: "exact" }
        );
      if (searchTerm) {
        queryBuilder = queryBuilder.ilike("fullname", `%${searchTerm}%`);
      }
      const start = (pageParam - 1) * ITEM_PER_PAGE;
      const end = start + ITEM_PER_PAGE - 1;
      queryBuilder = queryBuilder.range(start, end);
      const { data: fetchedData, error, count: fetchedCount } = await queryBuilder;
      if (error) {
        console.error("Error fetching residents:", error.message);
        setData([]);
        setCount(0);
      } else {
        setData(fetchedData || []);
        setCount(fetchedCount || 0);
      }
      setLoading(false);
    }
    fetchResidents();
  }, [pageParam, searchTerm]);

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Care Level",
      accessor: "carelevel",
      className: "hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Address",
      accessor: "address",
      className: "hidden lg:table-cell",
    },
    {
      header: "Blood Type",
      accessor: "bloodtype",
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

  // Update renderRow so the entire row is clickable
  const renderRow = (resident) => (
    <tr
      key={resident.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight cursor-pointer"
      onClick={() => router.push(`/dashboard/list/residents/${resident.id}`)}
    >
      <td className="flex items-center gap-4 p-4">
        {resident.img ? (
          <img
            src={resident.img}
            alt={resident.fullname || "Resident Avatar"}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center">
            <FaUserAlt className="text-gray-600" />
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="font-semibold">{resident.fullname}</h3>
          <p className="text-xs text-gray-500">
            {resident.dateofbirth
              ? new Intl.DateTimeFormat("en-GB").format(new Date(resident.dateofbirth))
              : "No DOB"}
          </p>
        </div>
      </td>
      <td className="hidden md:table-cell">{resident.carelevel}</td>
      <td className="hidden lg:table-cell">{resident.phone}</td>
      <td className="hidden lg:table-cell">{resident.address || "No Address"}</td>
      <td className="hidden lg:table-cell">{resident.bloodtype || "N/A"}</td>
      {role === "admin" && (
        <td onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/list/residents/${resident.id}`);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky"
            >
              <FaEye className="text-white" />
            </button>
            <FormContainer table="resident" type="delete" id={resident.id} />
          </div>
        </td>
      )}
    </tr>
  );

  if (loading) {
    return <div className="p-4">Loading Residents...</div>;
  }

  return (
    <>
    <Navbar />
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Residents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow text-gray-700">
              <FaFilter size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow text-gray-700">
              <FaSort size={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="resident" type="create" />
            )}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={pageParam} count={count} />
      <FormModal />
    </div>
    </>
  );
}

