"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import FormContainer from "@/components/FormContainer";
import Image from "next/image";
import { FaUser } from "react-icons/fa";

export default function SingleStaffPage({ params }) {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  // Hardcode role to "admin" for demo purposes (update with your auth hook)
  const [role, setRole] = useState("admin");

  useEffect(() => {
    async function fetchStaff() {
      setLoading(true);
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .eq("id", params.id)
        .single();
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

  if (loading) return <div className="p-4">Loading Staff...</div>;
  if (!staff) return notFound();

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Staff Details */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {staff.img ? (
              <Image
                src={staff.img}
                alt={staff.name}
                width={150}
                height={150}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser size={48} className="text-gray-500" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">
                {staff.name} {staff.surname}
              </h1>
              <p className="text-gray-500">{staff.email}</p>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Contact Information</h2>
            <p>
              <span className="font-medium">Phone:</span> {staff.phone}
            </p>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Role</h2>
            <p>{staff.role}</p>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-400">
              Created at:{" "}
              {staff.created_at
                ? new Date(staff.created_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
        {/* Right Column: Admin Actions */}
        {role === "admin" && (
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <div className="flex gap-2">
              <FormContainer table="staff" type="update" data={staff} />
              <FormContainer table="staff" type="delete" id={staff.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
