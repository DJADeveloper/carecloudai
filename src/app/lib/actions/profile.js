import { supabase } from "@/app/lib/supabase";

/**
 * Upsert a profile record for the given userId.
 * This function will create a new profile if none exists, or update the existing one.
 * @param {string} userId - The user's id.
 * @param {Object} profileData - The profile data to upsert.
 * @returns {Promise<{error: any}>}
 */
export async function updateProfile(userId, profileData) {
  try {
    // Upsert: If a conflict on "id" occurs, update the record.
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        },
        { onConflict: "id" }
      );
    if (error) {
      console.error("Error upserting profile:", error);
      return { error };
    }
    console.log("Profile upserted successfully");
    return { error: null };
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return { error };
  }
}

/**
 * Retrieve a single profile record by user id.
 * @param {string} userId - The user's id.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      console.error("Error getting profile:", error);
      throw error;
    }
    console.log("Profile retrieved:", data);
    return { data, error: null };
  } catch (error) {
    console.error("Error in getProfile:", error);
    return { data: null, error };
  }
}

/**
 * List all profile records, optionally excluding a specific user.
 * @param {string|null} excludeUserId - A user id to exclude from the results.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function listProfiles(excludeUserId = null) {
  try {
    let query = supabase.from("profiles").select("*");
    if (excludeUserId) {
      query = query.neq("id", excludeUserId);
    }
    const { data, error } = await query;
    if (error) {
      console.error("Error listing profiles:", error);
      throw error;
    }
    console.log("Profiles retrieved:", data?.length);
    return { data, error: null };
  } catch (error) {
    console.error("Error in listProfiles:", error);
    return { data: null, error };
  }
}
