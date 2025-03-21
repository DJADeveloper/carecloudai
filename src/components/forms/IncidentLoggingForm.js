"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { supabase } from "@/app/lib/supabase";

const IncidentForm = memo(({ incidentData, handleChange, residents }) => (
  <>
    <label className="block">
      <span className="text-gray-700">Incident Type</span>
      <input
        type="text"
        name="incident_type"
        value={incidentData.incident_type}
        onChange={handleChange}
        required
        className="mt-1 block w-full border border-gray-300 rounded p-2"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Description</span>
      <textarea
        name="description"
        value={incidentData.description}
        onChange={handleChange}
        required
        className="mt-1 block w-full border border-gray-300 rounded p-2"
        rows={3}
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Incident Date</span>
      <input
        type="datetime-local"
        name="incident_date"
        value={incidentData.incident_date || ""}
        onChange={handleChange}
        required
        className="mt-1 block w-full border border-gray-300 rounded p-2"
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Resolved</span>
      <select
        name="resolved"
        value={incidentData.resolved ? "true" : "false"}
        onChange={(e) =>
          handleChange({ target: { name: "resolved", value: e.target.value === "true" } })
        }
        className="mt-1 block w-full border border-gray-300 rounded p-2"
      >
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>
    </label>
    <label className="block">
      <span className="text-gray-700">Resolution Notes</span>
      <textarea
        name="resolution_notes"
        value={incidentData.resolution_notes}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded p-2"
        rows={3}
      />
    </label>
    <label className="block">
      <span className="text-gray-700">Select Resident</span>
      <select
        name="residentid"
        value={incidentData.residentid || ""}
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
  </>
));

function IncidentLoggingForm({ type, data, setOpen, relatedData = {} }) {
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

  const [incidentData, setIncidentData] = useState({
    incident_type: data?.incident_type || "",
    description: data?.description || "",
    incident_date: data?.incident_date || "",
    resolved: data?.resolved || false,
    resolution_notes: data?.resolution_notes || "",
    residentid: data?.residentid || "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setIncidentData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const normalizedData = {
      ...incidentData,
      incident_date: incidentData.incident_date === "" ? null : incidentData.incident_date,
    };
  
    if (!normalizedData.residentid) {
      console.error("Resident must be selected for incident logging.");
      return;
    }
    
    let result, error;
    if (type === "create") {
      result = await supabase.from("incidents").insert([normalizedData]);
      error = result.error;
    } else if (type === "update" && data?.id) {
      result = await supabase.from("incidents").update(normalizedData).eq("id", data.id);
      error = result.error;
    }
    
    if (error) {
      console.error(`Error ${type} incident:`, error.message);
    } else {
      console.log(`Incident ${type}d successfully!`, result.data);
    }
    setOpen(false);
  }, [type, incidentData, data?.id, setOpen]);

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Log Incident" : "Update Incident"}
      </h1>
      <IncidentForm
        incidentData={incidentData}
        handleChange={handleChange}
        residents={residents}
      />
    </form>
  );
}

export default memo(IncidentLoggingForm);
