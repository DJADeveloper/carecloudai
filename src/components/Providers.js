"use client";

import { UserProvider } from "@/context/UserContext";

export function Providers({ children }) {
  return <UserProvider>{children}</UserProvider>;
} 