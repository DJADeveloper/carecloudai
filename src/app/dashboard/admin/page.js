// src/app/dashboard/admin/page.js
"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import AdminPage from "@/components/rolePages/AdminPage";
import FormContainer from "@/components/FormContainer";
import ResidentListPage from "../list/residents/page";
import EventListPage from "../list/events/page";
import MedicationListPage from "../list/medications/page";
import IncidentListPage from "../list/incidents/page";

// Import list components


export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <AdminPage />

      {/* Section for Forms */}
      <div className="space-y-8">
        <section className="p-4 bg-gray-100 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Resident Form Test</h2>
          <FormContainer table="resident" type="create" />
        </section>
        <section className="p-4 bg-gray-100 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Staff Form Test</h2>
          <FormContainer table="staff" type="create" />
        </section>
        <section className="p-4 bg-gray-100 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Event Form Test</h2>
          <FormContainer table="event" type="create" />
        </section>
        <section className="p-4 bg-gray-100 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Medication Form Test</h2>
          <FormContainer table="medication" type="create" />
        </section>
        <section className="p-4 bg-gray-100 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Incident Form Test</h2>
          <FormContainer table="incident" type="create" />
        </section>
      </div>

      {/* Section for Lists */}
      <div className="space-y-8 mt-12">
        <section className="p-4 bg-white rounded-md">
          <h2 className="text-2xl font-bold mb-4">Resident List Test</h2>
          <ResidentListPage />
        </section>
        <section className="p-4 bg-white rounded-md">
          <h2 className="text-2xl font-bold mb-4">Event List Test</h2>
          <EventListPage />
        </section>
        <section className="p-4 bg-white rounded-md">
          <h2 className="text-2xl font-bold mb-4">Medication List Test</h2>
          <MedicationListPage />
        </section>
        <section className="p-4 bg-white rounded-md">
          <h2 className="text-2xl font-bold mb-4">Incident List Test</h2>
          <IncidentListPage />
        </section>
      </div>
    </DashboardLayout>
  );
}
