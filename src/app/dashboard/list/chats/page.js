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
import ChatWithUsers from "@/components/Chat";

export default function StaffListPage() {

//   if (loading) return <div className="p-4">Loading Chats...</div>;

  return (
    
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <ChatWithUsers />
    </div>
  );
}
