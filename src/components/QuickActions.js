"use client";

import React, { useState } from "react";
import {
  FaUserPlus,
  FaUsers,
  FaUserTie,
  FaExclamationTriangle,
  FaCalendarPlus,
  FaTimes
} from "react-icons/fa";
import FormContainer from "./FormContainer";

export default function QuickActions() {
  const [formState, setFormState] = useState({ table: null, type: null });

  const closeForm = () => setFormState({ table: null, type: null });

  // A helper for building each action button (card)
  const actions = [
    {
      label: "Create Resident",
      table: "resident",
      type: "create",
      icon: <FaUserPlus size={20} />
    },
    {
      label: "Create Family",
      table: "family",
      type: "create",
      icon: <FaUsers size={20} />
    },
    {
      label: "Create Staff",
      table: "staff",
      type: "create",
      icon: <FaUserTie size={20} />
    },
    {
      label: "Log Incident",
      table: "incident",
      type: "create",
      icon: <FaExclamationTriangle size={20} />
    },
    {
      label: "Create Event",
      table: "event",
      type: "create",
      icon: <FaCalendarPlus size={20} />
    }
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {/* Action Buttons */}
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => setFormState({ table: action.table, type: action.type })}
          className="w-36 h-28 bg-white rounded-xl shadow-sm hover:shadow-md 
                     flex flex-col items-center justify-center gap-2 
                     transition-transform transform hover:-translate-y-1 
                     border border-gray-200"
        >
          <div className="text-blue-600">{action.icon}</div>
          <span className="text-sm font-medium text-gray-700">
            {action.label}
          </span>
        </button>
      ))}

      {/* Modal Overlay & Form */}
      {formState.table && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          {/* Modal Card */}
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-xl relative">
            {/* Close Button */}
            <button
              onClick={closeForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
            >
              <FaTimes size={18} />
            </button>
            <FormContainer
              table={formState.table}
              type={formState.type}
              onClose={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}
