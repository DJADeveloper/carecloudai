// src/app/dashboard/staff/page.js
"use client";

import DashboardLayout from "@/components/DashboardLayout";
import StaffPage from "@/components/rolePages/StaffPage";


export default function StaffDashboard() {
  return (
    <DashboardLayout>
      <StaffPage />
    </DashboardLayout>
  );
}
