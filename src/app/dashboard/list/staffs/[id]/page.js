"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import FormContainer from "@/components/FormContainer";
import Image from "next/image";
import {
  FaUserTie,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function StaffProfile({ params }) {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("admin");

  useEffect(() => {
    async function fetchStaff() {
      setLoading(true);
      const { data, error } = await supabase.from("staff").select("*").eq("id", params.id).single();
      if (error) {
        console.error("Error fetching staff:", error.message);
        setStaff(null);
      } else {
        setStaff(data);
      }
      setLoading(false);
    }
    fetchStaff();
  }, [params.id]);

  if (loading) return <div className="p-4 text-center text-gray-600">Loading Staff...</div>;
  if (!staff) return notFound();

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="relative">
          {/* Banner Image */}
          <div className="h-36 md:h-44 bg-gradient-to-r from-blue-200 to-blue-400 rounded-t-xl"></div>
          {/* Profile Image */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            {staff.img ? (
              <Image src={staff.img} alt={staff.name} width={120} height={120} className="rounded-full border-4 border-white shadow-md" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                <FaUserTie size={48} className="text-gray-500" />
              </div>
            )}
          </div>
        </div>
        {/* Staff Name & Info */}
        <div className="text-center mt-14">
          <h1 className="text-2xl font-bold">{staff.name} {staff.surname}</h1>
          <p className="text-gray-500">{staff.role}</p>
          <div className="flex justify-center gap-4 text-gray-500 mt-2 text-sm">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt size={14} />
              <span>{staff.location || "No Location"}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt size={14} />
              <span>Joined {new Date(staff.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Profile Sections */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-4">
        <nav className="flex space-x-6 border-b pb-2">
          <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-2">Overview</button>
          <button className="text-gray-500 hover:text-blue-600">Schedule</button>
          <button className="text-gray-500 hover:text-blue-600">Documents</button>
          <button className="text-gray-500 hover:text-blue-600">Activity</button>
        </nav>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Summary & Work Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Summary Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Summary</h2>
            <p className="text-gray-600 text-sm">
              {staff.summary || "No summary available for this staff member."}
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-blue-500" size={14} /> {staff.phone || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-blue-500" size={14} /> {staff.email || "N/A"}
              </p>
            </div>
          </div>

          {/* Employment Details */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Employment Details</h2>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-center gap-2">
                <FaBriefcase className="text-blue-500" size={14} /> <strong>Department:</strong> {staff.department || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaBuilding className="text-blue-500" size={14} /> <strong>Office Location:</strong> {staff.office || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Residents & Schedule */}
        <div className="space-y-6">
          {/* Assigned Residents */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Assigned Residents</h2>
            <ul className="text-gray-600 text-sm space-y-1">
              <li><strong>John Doe</strong> – High Care Level</li>
              <li><strong>Jane Smith</strong> – Medium Care Level</li>
            </ul>
          </div>

          {/* Work Schedule */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Upcoming Schedule</h2>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>Monday – 8:00 AM - 4:00 PM</li>
              <li>Tuesday – 10:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      {role === "admin" && (
        <div className="mt-6 flex gap-4">
          <FormContainer table="staff" type="update" data={staff} />
          <FormContainer table="staff" type="delete" id={staff.id} />
        </div>
      )}
    </div>
  );
}
