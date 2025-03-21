"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import FormContainer from "@/components/FormContainer";
import Image from "next/image";
import { FaUserAlt, FaCalendarAlt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ResidentProfile({ params }) {
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("admin");

  useEffect(() => {
    async function fetchResident() {
      setLoading(true);
      const { data, error } = await supabase.from("residents").select("*").eq("id", params.id).single();
      if (error) {
        console.error("Error fetching resident:", error.message);
        setResident(null);
      } else {
        setResident(data);
      }
      setLoading(false);
    }
    fetchResident();
  }, [params.id]);

  if (loading) return <div className="p-4 text-center text-gray-600">Loading Resident...</div>;
  if (!resident) return notFound();

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="relative">
          {/* Banner Image */}
          <div className="h-36 md:h-44 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-xl"></div>
          {/* Profile Image */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            {resident.img ? (
              <Image src={resident.img} alt={resident.fullname} width={120} height={120} className="rounded-full border-4 border-white shadow-md" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                <FaUserAlt size={48} className="text-gray-500" />
              </div>
            )}
          </div>
        </div>
        {/* Resident Name & Info */}
        <div className="text-center mt-14">
          <h1 className="text-2xl font-bold">{resident.fullname}</h1>
          <p className="text-gray-500">{resident.carelevel} Care Level</p>
          <div className="flex justify-center gap-4 text-gray-500 mt-2 text-sm">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt size={14} />
              <span>{resident.address || "No Address"}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt size={14} />
              <span>Joined {new Date(resident.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Profile Sections */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-4">
        <nav className="flex space-x-6 border-b pb-2">
          <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-2">Overview</button>
          <button className="text-gray-500 hover:text-blue-600">Documents</button>
          <button className="text-gray-500 hover:text-blue-600">Activity</button>
        </nav>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Summary & Skills */}
        <div className="md:col-span-2 space-y-6">
          {/* Summary Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Summary</h2>
            <p className="text-gray-600 text-sm">
              {resident.summary || "No summary available for this resident."}
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-blue-500" size={14} /> {resident.phone || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-blue-500" size={14} /> {resident.email || "N/A"}
              </p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Emergency Contact</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Name:</strong> {resident.emergencycontactname || "N/A"}</p>
              <p><strong>Phone:</strong> {resident.emergencycontactphone || "N/A"}</p>
              <p><strong>Email:</strong> {resident.emergencycontactemail || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Additional Details */}
        <div className="space-y-6">
          {/* Additional Info */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Additional Details</h2>
            <ul className="text-gray-600 text-sm space-y-1">
              <li><strong>Blood Type:</strong> {resident.bloodtype || "N/A"}</li>
              <li><strong>Room ID:</strong> {resident.roomid || "None"}</li>
              <li><strong>Family ID:</strong> {resident.familyid || "None"}</li>
            </ul>
          </div>

          {/* Associations (e.g., Staff, Family) */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Connections</h2>
            <ul className="text-gray-600 text-sm space-y-1">
              <li><strong>Primary Care Staff:</strong> Assigned to John Doe</li>
              <li><strong>Family Contact:</strong> Jane Doe (Daughter)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      {role === "admin" && (
        <div className="mt-6 flex gap-4">
          <FormContainer table="resident" type="update" data={resident} />
          <FormContainer table="resident" type="delete" id={resident.id} />
        </div>
      )}
    </div>
  );
}
