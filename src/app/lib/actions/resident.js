// /lib/actions/Resident.js
import { supabase } from "@/app/lib/supabase";

/**
 * Create a new resident record.
 * @param {Object} residentData - The resident data object to insert.
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
 * @param {Object} [filters={}] - Filter criteria using match.
 * @param {Object} [range={ start: 0, end: 9 }] - Range for pagination.
 * @returns {Promise<{data: any, count: number, error: any}>}
 */
export async function listResidents(filters = {}, range = { start: 0, end: 9 }) {
  const { data, error, count } = await supabase
    .from("residents")
    .select("*", { count: "exact" })
    .match(filters)
    .range(range.start, range.end);
  return { data, count, error };
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
