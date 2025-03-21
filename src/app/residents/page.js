"use client";

import { useState, useEffect } from 'react';
import { supabase } from "@/app/lib/supabase";
import { useCurrentUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";

function ResidentsContent() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const { data: residents, error } = await supabase
        .from('residents')
        .select(`
          id,
          fullname,
          email,
          phone,
          address,
          dateofbirth,
          carelevel,
          emergencycontactname,
          emergencycontactphone,
          emergencycontactemail,
          created_at,
          img,
          bloodtype,
          roomid,
          familyid
        `)
        .order('fullname');

      if (error) {
        throw error;
      }

      setResidents(residents);
    } catch (error) {
      console.error('Error fetching residents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Residents</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {/* Add navigation to add resident form */}}
        >
          Add New Resident
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading residents...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {residents.map((resident) => (
            <div
              key={resident.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48">
                {resident.img ? (
                  <img
                    src={resident.img}
                    alt={resident.fullname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{resident.fullname}</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Care Level:</span>{' '}
                    <span className="capitalize">{resident.carelevel}</span>
                  </p>
                  <p>
                    <span className="font-medium">Date of Birth:</span>{' '}
                    {new Date(resident.dateofbirth).toLocaleDateString()}
                  </p>
                  {resident.bloodtype && (
                    <p>
                      <span className="font-medium">Blood Type:</span>{' '}
                      {resident.bloodtype}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Phone:</span> {resident.phone}
                  </p>
                  {resident.email && (
                    <p>
                      <span className="font-medium">Email:</span> {resident.email}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-medium mb-2">Emergency Contact</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{resident.emergencycontactname}</p>
                    <p>{resident.emergencycontactphone}</p>
                    <p>{resident.emergencycontactemail}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => {/* Add edit functionality */}}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    onClick={() => {/* Add delete functionality */}}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && residents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No residents found. Add some residents to get started.
        </div>
      )}
    </div>
  );
}

export default function ResidentsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'staff']}>
      <ResidentsContent />
    </ProtectedRoute>
  );
} 