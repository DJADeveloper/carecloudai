// src/app/dashboard/admin/page.js
"use client";


import DashboardLayout from "@/components/DashboardLayout";
import FormContainer from "@/components/FormContainer";
import ResidentForm from "@/components/forms/ResidentForm";
import AdminPage from "@/components/rolePages/AdminPage";
import { useState } from "react";

export default function AdminDashboard() {

    const [open, setOpen] = useState(true);
    const dummyData = null; // or some dummy resident data if needed
    const dummyRelatedData = { rooms: [], families: [] };
  
    if (!open) return <div>Form Closed</div>;
  return (
    <DashboardLayout>
      <AdminPage />
      <FormContainer table="resident" type="create"/>
    </DashboardLayout>
  );
}
