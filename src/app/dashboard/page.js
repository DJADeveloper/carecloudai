// src/app/dashboard/page.js
// "use client";
// import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase"; // adjust path as needed
// import Link from "next/link";

// export default function Dashboard() {
//   const [residents, setResidents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchResidents() {
//       const { data, error } = await supabase.from("residents").select("*");
//       console.log(data, 'data')
//       if (error) console.error("Error fetching residents:", error.message);
//       else setResidents(data);
//       setLoading(false);
//     }
//     fetchResidents();
//     console.log(residents);
//   }, []);

//   return (
//     <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
//       <h1>Dashboard</h1>
//       <Link href="/">Back to Home</Link>
//       <hr />
//       {loading ? (
//         <p>Loading residents...</p>
//       ) : (
//         <>
//           {residents.length > 0 ? (
//             <ul>
//               {residents.map((resident) => (
//                 <li key={resident.id}>
//                   {resident.fullname} - {resident.carelevel}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No residents found.</p>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
// import Menu from "@/components/Menu";
// import Navbar from "@/components/Navbar";
// src/app/dashboard/layout.js (or layout.jsx)

// src/app/dashboard/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function DashboardRedirect() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Get the role from user_metadata. Make sure your sign-up sets this field.
        const role = user.user_metadata?.role || "";
        if (role === "ADMIN") {
          router.push("/dashboard/admin");
        } else if (role === "STAFF") {
          router.push("/dashboard/staff");
        } else if (role === "FAMILY") {
          router.push("/dashboard/family");
        } else {
          // Fallback route if the role is not recognized
          router.push("/dashboard/default");
        }
      } else {
        // If no user is logged in, redirect to login page
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return <div>Loading dashboard...</div>;
}





