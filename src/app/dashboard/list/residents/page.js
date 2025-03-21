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
import { useCurrentUser } from "@/context/UserContext";
import { listResidents } from "@/app/lib/actions/resident";

export default function ResidentListPage() {
  const [data, setData] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const { user, loading: userLoading } = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1");
  const searchTerm = searchParams.get("search") || "";

  React.useEffect(() => {
    let mounted = true;

    const fetchResidents = async () => {
      if (userLoading || !user) {
        if (!userLoading && !user) setLoading(false);
        return;
      }

      try {
        console.log("🔍 Starting resident fetch");
        const filters = searchTerm ? { fullname: searchTerm } : {};
        const range = {
          start: (pageParam - 1) * ITEM_PER_PAGE,
          end: (pageParam * ITEM_PER_PAGE) - 1
        };

        const response = await listResidents(filters, range);
        console.log("📥 Received response:", response);

        if (!mounted) return;

        if (response.error) {
          console.error("❌ Error in response:", response.error);
          setData([]);
          setCount(0);
        } else {
          console.log("✅ Setting data:", {
            records: response.data?.length,
            total: response.count
          });
          setData(response.data || []);
          setCount(response.count || 0);
        }
      } catch (error) {
        console.error("❌ Fetch error:", error);
        if (mounted) {
          setData([]);
          setCount(0);
        }
      } finally {
        if (mounted) {
          console.log("🏁 Setting loading to false");
          setLoading(false);
        }
      }
    };

    console.log("🚀 Effect triggered:", { userLoading, hasUser: !!user });
    fetchResidents();

    return () => {
      mounted = false;
      console.log("♻️ Cleanup: component unmounted");
    };
  }, [pageParam, searchTerm, user, userLoading]);

  // Debugging render
  console.log("🎨 Render:", { 
    loading, 
    userLoading, 
    hasUser: !!user, 
    dataLength: data.length,
    pageParam,
    searchTerm 
  });

  // Define Table Columns
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
    ...(user ? [
      {
        header: "Actions",
        accessor: "action",
      },
    ] : []),
  ];

  // Render each Table Row
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
          <h3 className="font-semibold text-gray-800">{resident.fullname}</h3>
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
      {user && (
        <td onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/list/residents/${resident.id}`);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky hover:opacity-90 transition"
            >
              <FaEye className="text-white" />
            </button>
            <FormContainer table="resident" type="delete" id={resident.id} />
          </div>
        </td>
      )}
    </tr>
  );

  if (!user && !userLoading) {
    return <div className="p-4 text-gray-600">Please log in to view residents.</div>;
  }

  if (loading) {
    return <div className="p-4 text-gray-600">Loading Residents...</div>;
  }

  return (
    <>
      <div className="m-4 mt-0">
        <div className="bg-white shadow rounded-md p-4 flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h1 className="text-lg font-semibold text-gray-800">
              All Residents ({count})
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              {/* Search */}
              <TableSearch />
              {/* Filter/Sort/Create */}
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow text-gray-700 hover:opacity-90 transition">
                  <FaFilter size={14} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow text-gray-700 hover:opacity-90 transition">
                  <FaSort size={14} />
                </button>
                {user && (
                  <FormContainer table="resident" type="create" />
                )}
              </div>
            </div>
          </div>

          {data.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No residents found.
            </div>
          ) : (
            <>
              <Table columns={columns} renderRow={renderRow} data={data} />
              <Pagination page={pageParam} count={count} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
