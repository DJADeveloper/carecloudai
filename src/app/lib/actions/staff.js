// /lib/actions/Staff.js
import { supabase } from "@/app/lib/supabase";

/**
 * Create a new staff record.
 * @param {Object} staffData - The staff data to insert.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function createStaff(staffData) {
  const { data, error } = await supabase.from("staff").insert([staffData]);
  return { data, error };
}

/**
 * Retrieve a single staff record by ID.
 * @param {string} id - The staff member's ID.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function getStaff(id) {
  const { data, error } = await supabase.from("staff").select("*").eq("id", id).single();
  return { data, error };
}

/**
 * List staff members with optional filtering and pagination.
 * @param {Object} [filters={}] - Filtering conditions (e.g. { role: "ADMIN" }).
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
 * @param {string} id - The staff member's ID.
 * @param {Object} staffData - The updated staff data.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function updateStaff(id, staffData) {
  const { data, error } = await supabase.from("staff").update(staffData).eq("id", id);
  return { data, error };
}

/**
 * Delete a staff record by ID.
 * @param {string} id - The staff member's ID.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function deleteStaff(id) {
  const { data, error } = await supabase.from("staff").delete().eq("id", id);
  return { data, error };
}
