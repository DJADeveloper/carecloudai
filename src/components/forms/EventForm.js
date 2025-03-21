"use client";

import React, { useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";

function EventForm({ type, data, setOpen, relatedData = {} }) {
  // If you do not actually store 'residentid' in the "events" table, remove references here.
  const residents = relatedData.residents || [];
  const rooms = relatedData.rooms || [];

  // Local state reflecting your schema fields
  const [eventData, setEventData] = useState({
    title: data?.title || "",
    description: data?.description || "",
    starttime: data?.starttime || "",
    endtime: data?.endtime || "",
    roomid: data?.roomid || null,
    // If you are truly storing 'residentid', keep it. Otherwise remove it.
    residentid: data?.residentid || null,
  });

  // Multi-step approach
  const [step, setStep] = useState(1);

  // Generic onChange for fields
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    // For foreign keys, convert empty strings to null so you don't insert an empty string
    const newValue =
      (name === "roomid" || name === "residentid") && value === "" ? null : value;
    setEventData((prev) => ({ ...prev, [name]: newValue }));
  }, []);

  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);
  const prevStep = useCallback(() => setStep((prev) => prev - 1), []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result, error;
    if (type === "create") {
      // Insert new record into "events" table
      result = await supabase.from("events").insert([eventData]);
      error = result.error;
    } else if (type === "update" && data?.id) {
      // Update existing event record
      result = await supabase
        .from("events")
        .update(eventData)
        .eq("id", data.id);
      error = result.error;
    }

    if (error) {
      console.error(`Error ${type} event:`, error.message);
    } else {
      console.log(`Event ${type}d successfully!`, result.data);
    }

    setOpen(false);
  };

  // Step 1: Basic Info
  const StepOne = () => (
    <div className="flex flex-col gap-4">
      <label htmlFor="title" className="block">
        <span className="text-gray-700">Event Title</span>
        <input
          id="title"
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          autoComplete="off"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>

      <label htmlFor="description" className="block">
        <span className="text-gray-700">Description</span>
        <textarea
          id="description"
          name="description"
          value={eventData.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          rows={4}
        />
      </label>
    </div>
  );

  // Step 2: Timing & Associations
  const StepTwo = () => (
    <div className="flex flex-col gap-4">
      <label htmlFor="starttime" className="block">
        <span className="text-gray-700">Start Time</span>
        <input
          id="starttime"
          type="datetime-local"
          name="starttime"
          value={eventData.starttime}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>

      <label htmlFor="endtime" className="block">
        <span className="text-gray-700">End Time</span>
        <input
          id="endtime"
          type="datetime-local"
          name="endtime"
          value={eventData.endtime}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>

      {/* If your schema includes a 'roomid' column */}
      <label htmlFor="roomid" className="block">
        <span className="text-gray-700">Room (optional)</span>
        <select
          id="roomid"
          name="roomid"
          value={eventData.roomid || ""}
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

      {/* Only include if you actually store 'residentid' in your events table */}
      <label htmlFor="residentid" className="block">
        <span className="text-gray-700">Assign to Resident (optional)</span>
        <select
          id="residentid"
          name="residentid"
          value={eventData.residentid || ""}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        >
          <option value="">None</option>
          {residents.map((res) => (
            <option key={res.id} value={res.id}>
              {res.fullname}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <form
      key="event-form"
      onSubmit={handleSubmit}
      className="p-4 flex flex-col gap-4"
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Event" : "Update Event"}
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
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            {type === "create" ? "Create" : "Update"}
          </button>
        )}
      </div>
    </form>
  );
}

export default React.memo(EventForm);
