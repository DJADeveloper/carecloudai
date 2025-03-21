"use client";

import { useCurrentUser } from "@/context/UserContext";
import Link from "next/link";
import {
  FaHome,
  FaUsers,
  FaUserAlt,
  FaClipboardList,
  FaRegCalendarAlt,
  FaHospitalUser,
  FaBell,
  FaSignOutAlt,
  FaFacebookMessenger,
} from "react-icons/fa";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <FaHome />,
        label: "Dashboard",
        href: "/dashboard",
        visible: ["admin", "staff", "family", "resident"],
      },
      {
        icon: <FaUsers />,
        label: "Staff",
        href: "/dashboard/list/staffs",
        visible: ["admin", "staff"],
      },
      {
        icon: <FaUserAlt />,
        label: "Residents",
        href: "/dashboard/list/residents",
        visible: ["admin", "staff"],
      },
      {
        icon: <FaHospitalUser />,
        label: "Families",
        href: "/dashboard/list/families",
        visible: ["admin", "staff"],
      },
      {
        icon: <FaClipboardList />,
        label: "Care Plans",
        href: "/dashboard/list/carePlans",
        visible: ["admin", "staff", "family"],
      },
      {
        icon: <FaRegCalendarAlt />,
        label: "Rooms",
        href: "/dashboard/list/rooms",
        visible: ["admin", "staff"],
      },
      {
        icon: <FaClipboardList />,
        label: "Medical Records",
        href: "/dashboard/list/medicalRecords",
        visible: ["admin", "staff"],
      },
      {
        icon: <FaBell />,
        label: "Events",
        href: "/dashboard/list/events",
        visible: ["admin", "staff", "family", "resident"],
      },
      {
        icon: <FaFacebookMessenger />,
        label: "Chat",
        href: "/dashboard/list/chats",
        visible: ["admin", "staff", "family", "resident"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: <FaUserAlt />,
        label: "Profile",
        href: "/dashboard/profile",
        visible: ["admin", "staff", "family", "resident"],
      },
      {
        icon: <FaClipboardList />,
        label: "Settings",
        href: "/dashboard/settings",
        visible: ["admin", "staff", "family", "resident"],
      },
      {
        icon: <FaSignOutAlt />,
        label: "Logout",
        href: "/logout",
        visible: ["admin", "staff", "family", "resident"],
      },
    ],
  },
];

export default function Menu() {
  const { user, loading } = useCurrentUser();
  // Access the role from user_metadata since that's where it's set in your sign-up
  const role = user ? (user.user_metadata?.role || "guest").toLowerCase() : "guest";
 
  if (loading) return <div>Loading menu...</div>;

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((group) => (
        <div className="flex flex-col gap-2" key={group.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {group.title}
          </span>
          {group.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link href={item.href} legacyBehavior key={item.label}>
                  <a className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-gray-200">
                    {item.icon}
                    <span className="hidden lg:block">{item.label}</span>
                  </a>
                </Link>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
}
