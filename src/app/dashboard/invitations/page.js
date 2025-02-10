"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function InvitationSender() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch residents when the search term changes
  useEffect(() => {
    async function fetchResidents() {
      if (!searchTerm) {
        setResidents([]);
        return;
      }
      const { data, error } = await supabase
        .from("residents")
        .select("*")
        .ilike("fullname", `%${searchTerm}%`);
      if (error) {
        console.error("Error fetching residents:", error.message);
      } else {
        setResidents(data);
      }
    }
    fetchResidents();
  }, [searchTerm]);

  // Function to generate and "send" the invitation
  const sendInvitation = () => {
    if (!email || !selectedResident) {
      setMessage("Please enter a family email and select a resident.");
      return;
    }
    // Generate a simple token (for MVP only; production should have secure token logic)
    const invitationToken = Math.random().toString(36).substr(2, 9);
    // Build the invitation URL including the resident's ID, name, and token
    const invitationUrl = `${window.location.origin}/onboarding/family?residentId=${selectedResident.id}&residentName=${encodeURIComponent(selectedResident.fullname)}&invitationToken=${invitationToken}`;
    
    // Simulate sending email by logging the invitation URL to the console
    console.log("Invitation URL:", invitationUrl);
    setMessage(`Invitation sent to ${email}. (Check the console for the invitation link.)`);
    
    // Clear inputs
    setEmail("");
    setSearchTerm("");
    setResidents([]);
    setSelectedResident(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Send Family Invitation</h1>
      
      {message && <p className="mb-4 text-green-600">{message}</p>}
      
      {/* Input for family email */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Family Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="family@example.com"
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>
      
      {/* Search input for residents */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Search Residents</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by resident name"
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>
      
      {/* Display search results if any */}
      {residents.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Select a Resident:</p>
          <ul className="border border-gray-300 rounded p-2 max-h-40 overflow-y-auto">
            {residents.map((resident) => (
              <li
                key={resident.id}
                onClick={() => setSelectedResident(resident)}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${
                  selectedResident?.id === resident.id ? "bg-gray-300" : ""
                }`}
              >
                {resident.fullname}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Show selected resident information */}
      {selectedResident && (
        <div className="mb-4">
          <p className="text-gray-700">
            Selected Resident: <strong>{selectedResident.fullname}</strong>
          </p>
        </div>
      )}
      
      <button
        onClick={sendInvitation}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Send Invitation
      </button>
    </div>
  );
}
