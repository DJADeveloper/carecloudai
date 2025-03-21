"use client";

import { useState } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/context/UserContext";
import { supabase } from "./lib/supabase";
import LoginPage from "./login/page";

export default function Home() {
  const { user, loading } = useCurrentUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // We have removed the automatic redirect. So this effect is commented out:
  // useEffect(() => {
  //   if (!loading && user) {
  //     router.push("/dashboard");
  //   }
  // }, [user, loading, router]);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Error signing in: " + error.message);
    }
  };

  // const signOut = async () => {
  //   await supabase.auth.signOut();
  // };

  console.log("User:", user);
  console.log("Loading:", loading);

  if (loading) {
    return <div>Loading user session...</div>;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>CareCloud AI MVP</h1>
      {!user ? (
        <>
          <LoginPage />
        </>
      ) : (
        <div>
          <p style={{ marginBottom: "1rem" }}>
            <strong>User Signed In:</strong> {user.email}
            <br />
            <span style={{ fontSize: "0.85rem", color: "#555" }}>
              <strong>User ID:</strong> {user.id}
            </span>
          </p>

          {/* <button onClick={signOut} style={{ marginBottom: "1rem" }}> */}
          <button style={{ marginBottom: "1rem" }}>
            Sign Out
          </button>
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
