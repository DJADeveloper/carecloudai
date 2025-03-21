"use client";

import { supabase } from "@/app/lib/supabase";
import { useCurrentUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSearch, FaEnvelope, FaBell, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login'); // Redirect to login page after successful sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100">
      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full border border-gray-300 px-2">
        <FaSearch className="text-gray-600" size={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      {/* Icons and User Info */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <FaEnvelope className="text-gray-600" size={16} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <FaBell className="text-gray-600" size={16} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">
            {loading ? "Loading..." : user ? user.email : "Guest"}
          </span>
          <span className="text-[10px] text-gray-500 text-right">
            {loading ? "Loading..." : user ? (user.user_metadata?.role || "N/A") : "N/A"}
          </span>
        </div>
        {user && (
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-red-600 transition-colors"
          >
            <FaSignOutAlt size={14} />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
}
