// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "./lib/supabase";
import LoginPage from "./login/page";

export default function Home() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Error signing in: " + error.message);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>CareCloud AI MVP</h1>
      {!user && (
        <LoginPage />
      )}
      {user && (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={signOut}>Sign Out</button>
          <div>
            <h2>Select Dashboard (Development Only)</h2>
            <ul>
              <li>
                <Link href="/dashboard/admin">Admin Dashboard</Link>
              </li>
              <li>
                <Link href="/dashboard/staff">Staff Dashboard</Link>
              </li>
              <li>
                <Link href="/dashboard/family">Family Dashboard</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
