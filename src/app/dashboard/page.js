"use client";

import { useCurrentUser } from "@/context/UserContext";
import AdminPage from "@/components/rolePages/AdminPage";
import StaffPage from "@/components/rolePages/StaffPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  const role = user.user_metadata?.role?.toUpperCase();
  
  // Render appropriate dashboard based on role
  return (
    <ProtectedRoute allowedRoles={['admin', 'staff']}>
      {role === 'ADMIN' ? <AdminPage /> : <StaffPage />}
    </ProtectedRoute>
  );
}





