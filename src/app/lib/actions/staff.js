import { supabase } from "@/app/lib/supabase";

/**
 * Helper function to generate a temporary password.
 * (This is a simple implementation; consider a more secure method in production.)
 */
function generateTemporaryPassword() {
  return (
    Math.random().toString(36).slice(-8) +
    Math.random().toString(36).slice(-8)
  );
}

/**
 * Create a new staff record along with an associated auth user.
 * This function first creates a new auth user using Supabase's Admin API,
 * then inserts a new record into the "staff" table using the generated user id.
 *
 * @param {Object} staffData - The staff data to insert.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function createStaff(staffData) {
  // Create the auth user account
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: staffData.email,
    email_confirm: true,
    password: generateTemporaryPassword(),
    user_metadata: {
      name: staffData.name,
      surname: staffData.surname,
      role: staffData.role,
    },
  });

  if (userError) {
    return { error: userError };
  }

  // Create the staff record, using the new auth user's ID as user_id
  const { data: staffRecord, error: staffError } = await supabase
    .from("staff")
    .insert([{ user_id: userData.user.id, ...staffData }]);

  if (staffError) {
    // Cleanup: if staff insertion fails, delete the created auth user
    await supabase.auth.admin.deleteUser(userData.user.id);
    return { error: staffError };
  }

  return { data: staffRecord, userData };
}

/**
 * Retrieve a single staff record by user_id.
 * @param {string} userId - The staff member's user_id.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function getStaff(userId) {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("user_id", userId)
    .single();
  return { data, error };
}

/**
 * List staff members with optional filters and pagination.
 * @param {Object} [filters={}] - Filtering conditions (e.g., { role: "ADMIN" }).
 * @param {Object} [range={ start: 0, end: 9 }] - Pagination range.
 * @returns {Promise<{data: any, count: number, error: any}>}
 */
export async function listStaff(filters = {}, range = { start: 0, end: 9 }) {
  const { data, error, count } = await supabase
    .from("staff")
    .select("*", { count: "exact" })
    .match(filters)
    .range(range.start, range.end);
  return { data, count, error };
}

/**
 * Update an existing staff record.
 * @param {string} userId - The staff member's user_id.
 * @param {Object} staffData - The updated staff data.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function updateStaff(userId, staffData) {
  const { data, error } = await supabase
    .from("staff")
    .update(staffData)
    .eq("user_id", userId);
  return { data, error };
}

/**
 * Delete a staff record by user_id.
 * @param {string} userId - The staff member's user_id.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function deleteStaff(userId) {
  const { data, error } = await supabase
    .from("staff")
    .delete()
    .eq("user_id", userId);
  return { data, error };
}
