import { supabase } from "@/app/lib/supabase";

/**
 * Helper function to generate a temporary password.
 * (Simple implementation; consider a more secure approach in production.)
 */
function generateTemporaryPassword() {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
}

/**
 * Create a new family member with an associated auth user account.
 * Inserts a record into the "family" table using the new auth user's id as user_id.
 *
 * @param {Object} familyData - The family member data to insert.
 * @returns {Promise<{data: any, error: any, userData: any}>}
 */
export async function createFamily(familyData) {
  // First, create the auth user account using Supabase's Admin API.
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: familyData.email,
    email_confirm: true,
    password: generateTemporaryPassword(),
    user_metadata: {
      name: familyData.name,
      surname: familyData.surname,
      role: 'FAMILY'
    }
  });

  if (userError) {
    return { error: userError };
  }

  // Then insert the family record, using the new user's id as the user_id.
  const { data: familyRecord, error: familyError } = await supabase
    .from("family")
    .insert([{ ...familyData, user_id: userData.user.id }]);

  if (familyError) {
    // If insertion fails, clean up the created auth user.
    await supabase.auth.admin.deleteUser(userData.user.id);
    return { error: familyError };
  }

  return { data: familyRecord, userData };
}

/**
 * Retrieve a single family member record by user_id.
 *
 * @param {string} userId - The family member's user_id.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function getFamily(userId) {
  const { data, error } = await supabase
    .from("family")
    .select("*")
    .eq("user_id", userId)
    .single();
  return { data, error };
}

/**
 * List family members with optional filters and pagination.
 *
 * @param {Object} [filters={}] - Filtering conditions.
 * @param {Object} [range={ start: 0, end: 9 }] - Pagination range.
 * @returns {Promise<{data: any, count: number, error: any}>}
 */
export async function listFamily(filters = {}, range = { start: 0, end: 9 }) {
  const { data, error, count } = await supabase
    .from("family")
    .select("*", { count: "exact" })
    .match(filters)
    .range(range.start, range.end);
  return { data, count, error };
}

/**
 * Update an existing family member record by user_id.
 *
 * @param {string} userId - The family member's user_id.
 * @param {Object} familyData - The updated data.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function updateFamily(userId, familyData) {
  const { data, error } = await supabase
    .from("family")
    .update(familyData)
    .eq("user_id", userId);
  return { data, error };
}

/**
 * Delete a family member record by user_id.
 *
 * @param {string} userId - The family member's user_id.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function deleteFamily(userId) {
  const { data, error } = await supabase
    .from("family")
    .delete()
    .eq("user_id", userId);
  return { data, error };
}
