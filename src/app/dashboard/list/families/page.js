"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { supabase } from "@/app/lib/supabase";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { useCurrentUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";

function FamiliesContent() {
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useCurrentUser();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get current page from search params; default to 1.
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")) : 1;

  // Build query filter from search params.
  const query = {};
  if (searchParams.get("search")) {
    // We'll assume the search is on the family member's name.
    query.name = searchParams.get("search");
  }

  // Get the current user's role from Supabase user metadata.
  const role = user ? (user.user_metadata?.role || "guest").toLowerCase() : "guest";

  // Fetch family members from Supabase.
  useEffect(() => {
    async function fetchFamilyMembers() {
      setLoading(true);
      // Start with a query on the "family" table.
      let queryBuilder = supabase
        .from("family")
        // Assuming you have a relationship set up to fetch associated residents.
        .select("*, residents(*)", { count: "exact" });

      // Apply search filter if provided:
      if (query.name) {
        // Assuming the column in the family table is "name" (lowercase).
        queryBuilder = queryBuilder.ilike("name", `%${query.name}%`);
      }

      // Apply pagination (Supabase .range() accepts zero-based indices).
      queryBuilder = queryBuilder.range(
        ITEM_PER_PAGE * (page - 1),
        ITEM_PER_PAGE * page - 1
      );

      const { data, error, count } = await queryBuilder;
      if (error) {
        console.error("Error fetching family members:", error.message);
      } else {
        setData(data);
        setCount(count);
      }
      setLoading(false);
    }
    fetchFamilyMembers();
  }, [page, searchParams]);

  // Define columns for the table.
  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Resident Names",
      accessor: "residents",
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
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  // Define how to render each row.
  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">
        {(item.residents || [])
          .map((resident) => resident.fullname)
          .join(", ")}
      </td>
      <td className="hidden lg:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="family" type="update" data={item} />
              <FormContainer table="family" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  if (authLoading || loading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Family Members
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="family" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={page} count={count} />
    </div>
  );
}

export default function FamilyListPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'staff']}>
      <FamiliesContent />
    </ProtectedRoute>
  );
}
