"use client";

import React, { useState, useCallback, memo } from "react";
import { createFamily, updateFamily } from "@/app/lib/actions/families";

function FamilyForm({ type, data, setOpen }) {
  const [familyData, setFamilyData] = useState({
    name: data?.name || "",
    surname: data?.surname || "",
    email: data?.email || "",
    phone: data?.phone || "",
    address: data?.address || "",
    relationship: data?.relationship || "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFamilyData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (type === "create") {
      const { data, error, userData } = await createFamily(familyData);
      if (error) {
        console.error(`Error creating family:`, error.message);
        // You might want to show an error message to the user here
      } else {
        console.log(`Family created successfully!`, data);
        console.log(`User account created with temporary password`);
        // You might want to show a success message with the temporary password
        // or implement a system to email the temporary password to the user
      }
    } else if (type === "update" && data?.id) {
      const { data: updatedData, error } = await updateFamily(data.id, familyData);
      if (error) {
        console.error(`Error updating family:`, error.message);
      } else {
        console.log(`Family updated successfully!`, updatedData);
      }
    }
    setOpen(false);
  }, [type, familyData, data?.id, setOpen]);

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Family Member" : "Update Family Member"}
      </h1>
      <label className="block">
        <span className="text-gray-700">First Name</span>
        <input
          type="text"
          name="name"
          value={familyData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Surname</span>
        <input
          type="text"
          name="surname"
          value={familyData.surname}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Email</span>
        <input
          type="email"
          name="email"
          value={familyData.email}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Phone</span>
        <input
          type="tel"
          name="phone"
          value={familyData.phone}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Address</span>
        <input
          type="text"
          name="address"
          value={familyData.address}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Relationship to Resident</span>
        <input
          type="text"
          name="relationship"
          value={familyData.relationship}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>
      <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}

export default memo(FamilyForm); 