"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

// Lazy load your form components
const StaffForm = dynamic(() => import("./forms/StaffForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ResidentForm = dynamic(() => import("./forms/ResidentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const MedicationTrackingForm = dynamic(() => import("./forms/MedicationTrackingForm"), {
  loading: () => <h1>Loading...</h1>,
});
const IncidentLoggingForm = dynamic(() => import("./forms/IncidentLoggingForm"), {
  loading: () => <h1>Loading...</h1>,
});

// Map of forms to render based on the table
const forms = {
  staff: (setOpen, type, data, relatedData) => (
    <StaffForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  resident: (setOpen, type, data, relatedData) => (
    <ResidentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  event: (setOpen, type, data, relatedData) => (
    <EventForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  medication: (setOpen, type, data, relatedData) => (
    <MedicationTrackingForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  incident: (setOpen, type, data, relatedData) => (
    <IncidentLoggingForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  // Add more as needed
};

// Map of form types to icons
const iconMap = {
  create: <FaPlus size={16} />,
  update: <FaEdit size={16} />,
  delete: <FaTrash size={16} />,
};

const FormModal = ({ table, type, data, id, relatedData }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Choose the correct form component based on the table.
  const Form = () => {
    const formComponent = forms[table];
    if (!formComponent) {
      console.error(`Form not found for table: "${table}"`);
      return <div>Form not found!</div>;
    }
    // For deletion, render a simple confirmation form. (Assuming deleteActionMap is defined elsewhere.)
    return type === "delete" && id ? (
      <form
        action={deleteActionMap[table]}
        method="POST"
        className="p-4 flex flex-col gap-4"
      >
        <input type="hidden" name="id" value={id} />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md w-max self-center">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      formComponent(setOpen, type, data, relatedData)
    ) : (
      <div>Invalid form type!</div>
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        { iconMap[type] || <FaEdit size={16} />}
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <button className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                <FaTimes size={20} title="Close" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(FormModal);
