"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";

function MedicationTrackingForm({ type, data, setOpen, relatedData = {} }) {
  // Get residents from relatedData or fetch them if not provided
  const [residents, setResidents] = useState(relatedData.residents || []);

  useEffect(() => {
    async function fetchResidents() {
      if (!relatedData.residents) {
        const { data: resData, error } = await supabase
          .from("residents")
          .select("id, fullname");
        if (error) {
          console.error("Error fetching residents:", error.message);
        } else {
          setResidents(resData || []);
        }
      }
    }
    fetchResidents();
  }, [relatedData.residents]);

  // Initialize local state for medication data.
  const [medicationData, setMedicationData] = useState({
    medication_name: data?.medication_name || "",
    dosage: data?.dosage || "",
    schedule: data?.schedule || "", // expected to be a valid datetime string
    administered_at: data?.administered_at || "", // can be null if not administered yet
    status: data?.status || "scheduled",
    notes: data?.notes || "",
    residentid: data?.residentid || "", // required field
  });

  // Handle input changes. Convert empty values for timestamp fields to null.
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setMedicationData((prev) => {
      let newValue = value;
      // For residentid: if empty, set to null.
      if ((name === "residentid") && value === "") {
        newValue = null;
      }
      // For fields expecting a timestamp, convert empty string to null.
      if ((name === "schedule" || name === "administered_at") && value === "") {
        newValue = null;
      }
      return { ...prev, [name]: newValue };
    });
  }, []); // Empty dependency array since we're using the function updater form of setState

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Normalize timestamp fields before submitting
    const normalizedData = {
      ...medicationData,
      schedule: medicationData.schedule === "" ? null : medicationData.schedule,
      administered_at: medicationData.administered_at === "" ? null : medicationData.administered_at,
    };
  
    if (!normalizedData.residentid) {
      console.error("Resident must be selected.");
      return;
    }
  
    let result, error;
    if (type === "create") {
      result = await supabase.from("medications").insert([normalizedData]);
      error = result.error;
    } else if (type === "update" && data?.id) {
      result = await supabase.from("medications").update(normalizedData).eq("id", data.id);
      error = result.error;
    }
    if (error) {
      console.error(`Error ${type} medication:`, error.message);
    } else {
      console.log(`Medication ${type}d successfully!`, result.data);
    }
    setOpen(false);
  };
  

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Add Medication" : "Update Medication"}
      </h1>
      <label className="block">
        <span className="text-gray-700">Medication Name</span>
        <input
          type="text"
          name="medication_name"
          value={medicationData.medication_name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Dosage</span>
        <input
          type="text"
          name="dosage"
          value={medicationData.dosage}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Schedule</span>
        <input
          type="datetime-local"
          name="schedule"
          value={medicationData.schedule || ""}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Status</span>
        <select
          name="status"
          value={medicationData.status}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        >
          <option value="scheduled">Scheduled</option>
          <option value="administered">Administered</option>
          <option value="missed">Missed</option>
        </select>
      </label>
      <label className="block">
        <span className="text-gray-700">Notes</span>
        <textarea
          name="notes"
          value={medicationData.notes}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          rows={3}
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Select Resident</span>
        <select
          name="residentid"
          value={medicationData.residentid || ""}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        >
          <option value="">--Select a Resident--</option>
          {residents.map((r) => (
            <option key={r.id} value={r.id}>
              {r.fullname}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
        {type === "create" ? "Add Medication" : "Update Medication"}
      </button>
    </form>
  );
}

export default React.memo(MedicationTrackingForm);
