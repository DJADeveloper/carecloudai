"use client";
import Link from "next/link";
import { useCurrentUser } from "@/context/UserContext";

export default function UnauthorizedPage() {
  const { user, signOut } = useCurrentUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        
        <div className="space-y-4">
          {user ? (
            <>
              <p className="text-sm text-gray-500">
                Signed in as: {user.email} ({user.user_metadata?.role || "No role"})
              </p>
              <div className="flex flex-col space-y-2">
                <Link 
                  href="/"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Go to Home
                </Link>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link 
              href="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors inline-block"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 