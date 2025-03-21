"use client";

import React, { useState, useCallback, memo } from "react";
import { supabase } from "@/app/lib/supabase";
import { createStaff, updateStaff } from "@/app/lib/actions/staff";

// Memoize the step components
const StepOne = memo(({ staffData, handleChange }) => (
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
));

// Memoize the step two component
const StepTwo = memo(({ staffData, handleChange, roles }) => (
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
));

function StaffForm({ type, data, setOpen, relatedData = {} }) {
  const roles = relatedData?.roles || ["ADMIN", "NURSE", "CAREGIVER"];
  const [step, setStep] = useState(1);
  const [staffData, setStaffData] = useState({
    name: data?.name || "",
    surname: data?.surname || "",
    email: data?.email || "",
    phone: data?.phone || "",
    role: data?.role || roles[0],
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setStaffData(prev => ({ ...prev, [name]: value }));
  }, []);

  const nextStep = useCallback(() => setStep(prev => prev + 1), []);
  const prevStep = useCallback(() => setStep(prev => prev - 1), []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (type === "create") {
      const { data, error, userData } = await createStaff(staffData);
      if (error) {
        console.error(`Error creating staff:`, error.message);
      } else {
        console.log(`Staff created successfully!`, data);
        console.log(`User account created with temporary password`);
      }
    } else if (type === "update" && data?.id) {
      const { data: updatedData, error } = await updateStaff(data.id, staffData);
      if (error) {
        console.error(`Error updating staff:`, error.message);
      } else {
        console.log(`Staff updated successfully!`, updatedData);
      }
    }
    setOpen(false);
  }, [type, staffData, data?.id, setOpen]);

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Staff" : "Update Staff"}
      </h1>
      {step === 1 && <StepOne staffData={staffData} handleChange={handleChange} />}
      {step === 2 && <StepTwo staffData={staffData} handleChange={handleChange} roles={roles} />}
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

export default memo(StaffForm);
