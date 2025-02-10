"use client";

import React, { useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";

function ResidentForm({ type, data, setOpen, relatedData = {} }) {
  // Extract related data
  const families = relatedData.families || [];
  const rooms = relatedData.rooms || [];

  // Local state with keys matching your DB columns (all lowercase)
  const [residentData, setResidentData] = useState({
    fullname: data?.fullname || "",
    email: data?.email || "",
    phone: data?.phone || "",
    address: data?.address || "",
    dateofbirth: data?.dateofbirth || "",
    carelevel: data?.carelevel || "LOW",
    emergencycontactname: data?.emergencycontactname || "",
    emergencycontactphone: data?.emergencycontactphone || "",
    emergencycontactemail: data?.emergencycontactemail || "",
    familyid: data?.familyid || null,
    roomid: data?.roomid || null,
  });

  const [step, setStep] = useState(1);

  // Step navigation functions
  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);
  const prevStep = useCallback(() => setStep((prev) => prev - 1), []);

  // Handle input changes. For uuid fields, convert empty strings to null.
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const newValue = (name === "roomid" || name === "familyid") && value === "" ? null : value;
    setResidentData((prev) => ({ ...prev, [name]: newValue }));
  }, []);

  // Handle form submission: create or update record in Supabase.
  const handleSubmit = async (e) => {
    e.preventDefault();
    let result, error;
    if (type === "create") {
      result = await supabase.from("residents").insert([residentData]);
      error = result.error;
    } else if (type === "update" && data?.id) {
      result = await supabase.from("residents").update(residentData).eq("id", data.id);
      error = result.error;
    }
    if (error) {
      console.error(`Error ${type} resident:`, error.message);
    } else {
      console.log(`Resident ${type}d successfully!`, result.data);
    }
    // Close modal after submit
    setOpen(false);
  };

  // Step 1: Basic Info
  const StepOne = () => (
    <div className="flex flex-col gap-4">
      <label htmlFor="fullname" className="block">
        <span className="text-gray-700">Full Name</span>
        <input
          id="fullname"
          type="text"
          name="fullname"
          value={residentData.fullname}
          onChange={handleChange}
          autoComplete="name"
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
          value={residentData.email}
          onChange={handleChange}
          autoComplete="email"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>
      <label htmlFor="phone" className="block">
        <span className="text-gray-700">Phone</span>
        <input
          id="phone"
          type="text"
          name="phone"
          value={residentData.phone}
          onChange={handleChange}
          autoComplete="tel"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>
      <label htmlFor="address" className="block">
        <span className="text-gray-700">Address</span>
        <input
          id="address"
          type="text"
          name="address"
          value={residentData.address}
          onChange={handleChange}
          autoComplete="street-address"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>
    </div>
  );

  // Step 2: More Detailed Info
  const StepTwo = () => (
    <div className="flex flex-col gap-4">
      <label htmlFor="dateofbirth" className="block">
        <span className="text-gray-700">Date of Birth</span>
        <input
          id="dateofbirth"
          type="date"
          name="dateofbirth"
          value={residentData.dateofbirth}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>
      <label htmlFor="carelevel" className="block">
        <span className="text-gray-700">Care Level</span>
        <select
          id="carelevel"
          name="carelevel"
          value={residentData.carelevel}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
      </label>
      <label htmlFor="emergencycontactname" className="block">
        <span className="text-gray-700">Emergency Contact Name</span>
        <input
          id="emergencycontactname"
          type="text"
          name="emergencycontactname"
          value={residentData.emergencycontactname}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>
      <label htmlFor="emergencycontactphone" className="block">
        <span className="text-gray-700">Emergency Contact Phone</span>
        <input
          id="emergencycontactphone"
          type="text"
          name="emergencycontactphone"
          value={residentData.emergencycontactphone}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>
      <label htmlFor="emergencycontactemail" className="block">
        <span className="text-gray-700">Emergency Contact Email</span>
        <input
          id="emergencycontactemail"
          type="email"
          name="emergencycontactemail"
          value={residentData.emergencycontactemail}
          onChange={handleChange}
          autoComplete="email"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>
    </div>
  );

  // Step 3: Family & Room Association
  const StepThree = () => (
    <div className="flex flex-col gap-4">
      <label htmlFor="familyid" className="block">
        <span className="text-gray-700">Assign to Family</span>
        <select
          id="familyid"
          name="familyid"
          value={residentData.familyid || ""}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        >
          <option value="">No Family</option>
          {families.map((fam) => (
            <option key={fam.id} value={fam.id}>
              {fam.name} {fam.surname}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="roomid" className="block">
        <span className="text-gray-700">Room</span>
        <select
          id="roomid"
          name="roomid"
          value={residentData.roomid || ""}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        >
          <option value="">No Room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <form key="resident-form" onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Resident" : "Update Resident"}
      </h1>
      {step === 1 && <StepOne />}
      {step === 2 && <StepTwo />}
      {step === 3 && <StepThree />}
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
        {step < 3 && (
          <button
            type="button"
            onClick={nextStep}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Next
          </button>
        )}
        {step === 3 && (
          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
            {type === "create" ? "Create" : "Update"}
          </button>
        )}
      </div>
    </form>
  );
}

export default React.memo(ResidentForm);
