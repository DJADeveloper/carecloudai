"use client";

import Navbar from "@/components/Navbar";
import Menu from "@/components/Menu";
import Link from "next/link";
import { FaCloud } from "react-icons/fa";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex">
      {/* LEFT SIDE: Sidebar Menu */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link href="/" legacyBehavior>
          <a className="flex items-center justify-center lg:justify-start gap-2">
            <FaCloud size={32} className="text-blue-500" />
            <span className="hidden lg:block font-bold">Care Cloud AI</span>
          </a>
        </Link>
        <Menu />
      </div>
      {/* RIGHT SIDE: Main Content */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}