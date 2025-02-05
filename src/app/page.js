"use client"
// pages/index.js
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Link from "next/link";


export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Get current session on load
  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    }
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("Error signing in: " + error.message);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>CareCloud AI MVP</h1>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={signOut}>Sign Out</button>
          <br /><br />
          <Link href="./dashboard">Go to Dashboard</Link>

        </>
      ) : (
        <>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginRight: "1rem" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginRight: "1rem" }}
            />
            <button onClick={signIn}>Sign In</button>
          </div>
          <p>Or sign up using Supabase's authentication (set that up in your Supabase dashboard).</p>
        </>
      )}
    </div>
  );
}
