"use client";

import React, { useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";

function StaffForm({ type, data, setOpen, relatedData = {} }) {
  // Extract available roles from relatedData (or default to these values)
  const roles = relatedData?.roles || ["ADMIN", "NURSE", "CAREGIVER"];

  // Local state for multi-step form; prefill data if available.
  const [step, setStep] = useState(1);
  const [staffData, setStaffData] = useState({
    name: data?.name || "",
    surname: data?.surname || "",
    email: data?.email || "",
    phone: data?.phone || "",
    role: data?.role || roles[0],
  });

  // useCallback to keep handlers stable
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setStaffData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);
  const prevStep = useCallback(() => setStep((prev) => prev - 1), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result, error;
    if (type === "create") {
      result = await supabase.from("staff").insert([staffData]);
      error = result.error;
    } else if (type === "update" && data?.id) {
      result = await supabase.from("staff").update(staffData).eq("id", data.id);
      error = result.error;
    }
    if (error) {
      console.error(`Error ${type} staff:`, error.message);
    } else {
      console.log(`Staff ${type}d successfully!`, result.data);
    }
    setOpen(false);
  };

  // Step 1: Basic Info
  const StepOne = () => (
    <div className="flex flex-col gap-4">
      <label htmlFor="name" className="block">
        <span className="text-gray-700">First Name</span>
        <input
          id="name"
          type="text"
          name="name"
          value={staffData.name}
          onChange={handleChange}
          autoComplete="given-name"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>
      <label htmlFor="surname" className="block">
        <span className="text-gray-700">Surname</span>
        <input
          id="surname"
          type="text"
          name="surname"
          value={staffData.surname}
          onChange={handleChange}
          autoComplete="family-name"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>
      <label htmlFor="email" className="block">
        <span className="text-gray-700">Email</span>
        <input
          id="email"
          type="email"
          name="email"
          value={staffData.email}
          onChange={handleChange}
          autoComplete="email"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>
    </div>
  );

  // Step 2: Role & Contact
  const StepTwo = () => (
    <div className="flex flex-col gap-4">
      <label htmlFor="phone" className="block">
        <span className="text-gray-700">Phone</span>
        <input
          id="phone"
          type="text"
          name="phone"
          value={staffData.phone}
          onChange={handleChange}
          autoComplete="tel"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>
      <label htmlFor="role" className="block">
        <span className="text-gray-700">Role</span>
        <select
          id="role"
          name="role"
          value={staffData.role}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        >
          {roles.map((roleOption) => (
            <option key={roleOption} value={roleOption}>
              {roleOption}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Staff" : "Update Staff"}
      </h1>
      {step === 1 && <StepOne />}
      {step === 2 && <StepTwo />}
      <div className="flex justify-end gap-2 mt-4">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
          >
            Back
          </button>
        )}
        {step < 2 && (
          <button
            type="button"
            onClick={nextStep}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Next
          </button>
        )}
        {step === 2 && (
          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
            {type === "create" ? "Create" : "Update"}
          </button>
        )}
      </div>
    </form>
  );
}

export default React.memo(StaffForm);
