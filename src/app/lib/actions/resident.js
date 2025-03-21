import { supabase } from "@/app/lib/supabase";

/**
 * Create a new resident record.
 * @param {Object} residentData - The resident data to insert.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function createResident(residentData) {
  const { data, error } = await supabase
    .from("residents")
    .insert([residentData]);
  return { data, error };
}

/**
 * Retrieve a single resident record by id.
 * @param {string} id - The resident's id.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function getResident(id) {
  const { data, error } = await supabase
    .from("residents")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
}

/**
 * List residents with optional filters and pagination.
 * @param {Object} [filters={}] - Filter criteria (e.g., { carelevel: 'HIGH' }).
 * @param {Object} [range={ start: 0, end: 9 }] - Pagination range.
 * @returns {Promise<{data: any, count: number, error: any}>}
 */
export async function listResidents(filters = {}, range = { start: 0, end: 9 }) {
  try {
    // Build the query with count
    let query = supabase
      .from("residents")
      .select("*", { count: "exact" });
    
    // Apply filters if provided
    if (Object.keys(filters).length > 0) {
      query = query.match(filters);
    }
    
    // Apply range for pagination
    query = query.range(range.start, range.end);
    
    // Optionally, add a timeout to prevent hanging queries
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Query timeout")), 5000)
    );
    
    // Race between query and timeout
    const { data, error, count } = await Promise.race([query, timeoutPromise]);
    
    if (error) {
      throw error;
    }
    
    return { data: data || [], error: null, count: count || 0 };
  } catch (error) {
    console.error("Error listing residents:", error);
    return { data: null, error: error, count: 0 };
  }
}

/**
 * Update an existing resident record.
 * @param {string} id - The resident's id.
 * @param {Object} residentData - The updated resident data.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function updateResident(id, residentData) {
  const { data, error } = await supabase
    .from("residents")
    .update(residentData)
    .eq("id", id);
  return { data, error };
}

/**
 * Delete a resident record by id.
 * @param {string} id - The resident's id.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function deleteResident(id) {
  const { data, error } = await supabase
    .from("residents")
    .delete()
    .eq("id", id);
  return { data, error };
}
