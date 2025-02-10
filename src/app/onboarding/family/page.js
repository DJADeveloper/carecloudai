"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function FamilyRegistration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Extract query parameters from the URL
  const residentId = searchParams.get("residentId");
  const residentName = searchParams.get("residentName");
  const invitationToken = searchParams.get("invitationToken");
  
  // For MVP, we simply log the token; production would require token validation.
  useEffect(() => {
    console.log("Invitation Token:", invitationToken);
  }, [invitationToken]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    // Sign up the family member and store the role and resident association in user_metadata
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "FAMILY",
          residentId: residentId, // associate this family member with the resident
          residentName: residentName, // store the resident's name for convenience
        },
      },
    });
    if (error) {
      setErrorMsg(error.message);
    } else {
      // On successful registration, redirect to the dashboard (or a success page)
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Family Registration</h1>
        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
        <p className="mb-4 text-sm text-gray-600">
          You are registering as a family member for Resident:{" "}
          {residentName || "N/A"}
        </p>
        <label className="block mb-4">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </label>
        <label className="block mb-6">
          <span className="text-gray-700">Confirm Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Register
        </button>
      </form>
    </div>
  );
}
