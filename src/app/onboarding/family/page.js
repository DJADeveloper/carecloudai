"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { updateProfile } from "@/app/lib/actions/profile";

export default function FamilyRegistration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const residentId = searchParams.get("residentId");
  const residentName = searchParams.get("residentName");
  const invitationToken = searchParams.get("invitationToken");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    phone: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: "family",
            residentId: residentId,
            residentName: residentName,
          },
        },
      });

      if (authError) throw authError;

      // 2. Create their profile
      const { error: profileError } = await updateProfile(authData.user.id, {
        name: formData.name,
        surname: formData.surname,
        role: "family",
        phone: formData.phone,
        resident_id: residentId,
        resident_name: residentName
      });

      if (profileError) throw profileError;

      // 3. Success - redirect to dashboard
      router.push("/dashboard");

    } catch (error) {
      console.error("Registration error:", error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Family Registration</h1>
        
        {errorMsg && (
          <p className="text-red-500 mb-4 text-center">{errorMsg}</p>
        )}
        
        <p className="mb-6 text-sm text-gray-600">
          You are registering as a family member for Resident:{" "}
          <span className="font-medium">{residentName || "N/A"}</span>
        </p>

        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700">First Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Last Name</span>
            <input
              type="text"
              name="surname"
              value={formData.surname}
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
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Phone Number</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-2 px-4 rounded text-white ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
