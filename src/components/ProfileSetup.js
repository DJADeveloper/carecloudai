import { useState } from 'react';
import { updateProfile } from '@/app/lib/actions/profile';
import { useCurrentUser } from '@/context/UserContext';

export default function ProfileSetup() {
  const { user, profile, refreshProfile } = useCurrentUser();
  const [name, setName] = useState(profile?.name || '');
  const [surname, setSurname] = useState(profile?.surname || '');
  const [role, setRole] = useState(profile?.role || 'user');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await updateProfile(user.id, {
        name,
        surname,
        role
      });

      if (error) throw error;
      await refreshProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile!');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Surname</label>
        <input
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="family">Family</option>
          <option value="resident">Resident</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
} 