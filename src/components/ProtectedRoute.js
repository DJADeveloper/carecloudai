"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/context/UserContext";
import { supabase } from "@/app/lib/supabase";

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], // Array of allowed roles, empty means any authenticated user
  redirectTo = "/login" 
}) {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for user context to load
        if (loading) return;

        // If no user, redirect to login
        if (!user) {
          console.log("No user found, redirecting to", redirectTo);
          router.push(redirectTo);
          return;
        }

        // If roles are specified, check if user has required role
        if (allowedRoles.length > 0) {
          const userRole = user.user_metadata?.role?.toLowerCase();
          if (!userRole || !allowedRoles.includes(userRole)) {
            console.log("User doesn't have required role, redirecting");
            router.push("/unauthorized");
            return;
          }
        }

        // User is authorized
        setIsAuthorized(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [user, loading, router, redirectTo, allowedRoles]);

  // Show loading state while checking
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show children only if authorized
  return isAuthorized ? children : null;
} 