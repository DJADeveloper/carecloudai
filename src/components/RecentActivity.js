"use client";

import React, { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useCurrentUser } from "@/context/UserContext";

export default function RecentActivity() {
  const { dbData } = useCurrentUser();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Format incidents into activities
    const formattedActivities = dbData.incidents.map(incident => ({
      id: incident.id,
      description: incident.description || 
        `New ${incident.incident_type} incident reported${incident.resident ? ` for ${incident.resident.fullname}` : ''}`,
      created_at: incident.created_at,
      type: incident.incident_type
    }));

    setActivities(formattedActivities);
  }, [dbData.incidents]);

  // Format the timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString();
  };

  // Get appropriate color based on incident type
  const getIncidentTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'emergency':
        return 'text-red-600';
      case 'medical':
        return 'text-orange-600';
      case 'behavioral':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="p-4 bg-white rounded-md shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
        <FiMoreVertical className="text-gray-400 cursor-pointer hover:text-gray-600" size={20} />
      </div>

      {activities.length === 0 ? (
        <div className="text-sm text-gray-500 py-2">No recent activity found.</div>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li 
              key={activity.id} 
              className="text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0"
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${getIncidentTypeColor(activity.type)}`}>
                  {activity.type}
                </span>
                <div className="text-gray-700">{activity.description}</div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {formatTimestamp(activity.created_at)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
