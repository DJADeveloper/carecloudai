"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Lazy load your form components
const StaffForm = dynamic(() => import("./forms/StaffForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ResidentForm = dynamic(() => import("./forms/ResidentForm"), {
  loading: () => <h1>Loading...</h1>,
});
// Other form components can be added similarly

// Map of forms to render based on the table
const forms = {
  staff: (setOpen, type, data, relatedData) => (
    <StaffForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  resident: (setOpen, type, data, relatedData) => (
    <ResidentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  // Additional forms (family, room, etc.) can be added here.
};

const FormModal = ({ table, type, data, id, relatedData }) =>{
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Removed router.refresh() to avoid unnecessary re-mounts.

  // Choose the correct form component based on the table.
  const Form = () => {
    const formComponent = forms[table];

    if (!formComponent) {
      console.error(`Form not found for table: "${table}"`);
      return <div>Form not found!</div>;
    }

    // For deletion, render a simple confirmation form.
    // (Ensure that deleteActionMap is defined if you plan to use deletion)
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
        <Image src={`/${type}.png`} alt={`${type} icon`} width={16} height={16} />
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(FormModal);
