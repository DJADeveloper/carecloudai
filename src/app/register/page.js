"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { updateProfile } from "@/app/lib/actions/profile";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    role: "admin" // Default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      console.log("Starting registration process...");

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Test Supabase connection first
      const { data: sessionTest } = await supabase.auth.getSession();
      console.log("Connection test:", sessionTest);

      // 1. Sign up with Supabase Auth
      console.log("Creating auth user...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            surname: formData.surname,
            role: formData.role
          }
        }
      });

      if (authError) {
        console.error("Auth Error Details:", {
          message: authError.message,
          status: authError.status,
          details: authError
        });
        throw authError;
      }

      if (!authData.user?.id) {
        throw new Error("No user ID returned from registration");
      }

      console.log("Auth user created:", authData.user.id);

      // 2. Create profile
      console.log("Creating profile...");
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: formData.email,
          name: formData.name,
          surname: formData.surname,
          role: formData.role
        });

      if (profileError) {
        console.error("Profile Error Details:", {
          message: profileError.message,
          code: profileError.code,
          details: profileError
        });
        throw profileError;
      }

      console.log("Registration completed successfully");
      setErrorMsg("Registration successful! Please check your email for confirmation.");
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      console.error("Registration error details:", {
        name: error.name,
        message: error.message,
        code: error.code,
        status: error?.status,
        stack: error.stack
      });

      // More user-friendly error messages
      if (error.message?.includes("503")) {
        setErrorMsg("Service temporarily unavailable. Please try again in a few minutes.");
      } else if (error.message?.includes("network")) {
        setErrorMsg("Network connection issue. Please check your internet connection.");
      } else {
        setErrorMsg(error.message || "An error occurred during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        
        {errorMsg && (
          <p className="text-red-500 mb-4 text-center">{errorMsg}</p>
        )}

        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700">First Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Role</span>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="family">Family</option>
              <option value="resident">Resident</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 bg-green-500 text-white py-2 rounded ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "hover:bg-green-600"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a className="text-blue-500 hover:underline" href="/login">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
