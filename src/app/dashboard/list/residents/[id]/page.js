"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import FormContainer from "@/components/FormContainer";
import Image from "next/image";
import { FaUserAlt, FaEdit, FaTrash } from "react-icons/fa";

export default function SingleResidentPage({ params }) {
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);
  // For demo purposes, we hardcode the role; in production, retrieve this from your auth hook.
  const [role, setRole] = useState("admin");

  useEffect(() => {
    async function fetchResident() {
      setLoading(true);
      const { data, error } = await supabase
        .from("residents")
        .select("*")
        .eq("id", params.id)
        .single();
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

  if (loading) {
    return <div className="p-4">Loading Resident...</div>;
  }

  if (!resident) {
    return notFound();
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Resident Information */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {resident.img ? (
              <Image
                src={resident.img}
                alt={resident.fullname}
                width={150}
                height={150}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUserAlt size={48} className="text-gray-500" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{resident.fullname}</h1>
              <p className="text-gray-500">{resident.email}</p>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Contact Information</h2>
            <p>
              <span className="font-medium">Phone:</span> {resident.phone}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {resident.address || "N/A"}
            </p>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <p>
              <span className="font-medium">Date of Birth:</span>{" "}
              {resident.dateofbirth
                ? new Date(resident.dateofbirth).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <span className="font-medium">Care Level:</span>{" "}
              {resident.carelevel}
            </p>
            <p>
              <span className="font-medium">Blood Type:</span>{" "}
              {resident.bloodtype || "N/A"}
            </p>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Emergency Contact</h2>
            <p>
              <span className="font-medium">Name:</span>{" "}
              {resident.emergencycontactname || "N/A"}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {resident.emergencycontactphone || "N/A"}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {resident.emergencycontactemail || "N/A"}
            </p>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Associations</h2>
            <p>
              <span className="font-medium">Family ID:</span>{" "}
              {resident.familyid || "None"}
            </p>
            <p>
              <span className="font-medium">Room ID:</span>{" "}
              {resident.roomid || "None"}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-400">
              Created at:{" "}
              {resident.created_at
                ? new Date(resident.created_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Right Column: Actions */}
        {role === "admin" && (
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <div className="flex gap-2">
              {/* Update Button: triggers modal for updating */}
              <FormContainer table="resident" type="update" data={resident} />
              {/* Delete Button: triggers modal for deletion */}
              <FormContainer table="resident" type="delete" id={resident.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


