// /lib/actions/Family.js
import { supabase } from "@/app/lib/supabase";

/**
 * Create a new family member.
 * @param {Object} familyData - The family member data to insert.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function createFamily(familyData) {
  const { data, error } = await supabase.from("family").insert([familyData]);
  return { data, error };
}

/**
 * Retrieve a single family member record by id.
 * @param {string} id - The family member's id.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function getFamily(id) {
  const { data, error } = await supabase.from("family").select("*").eq("id", id).single();
  return { data, error };
}

/**
 * List family members with optional filters and pagination.
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
 * Update an existing family member record.
 * @param {string} id - The family member's id.
 * @param {Object} familyData - The updated data.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function updateFamily(id, familyData) {
  const { data, error } = await supabase.from("family").update(familyData).eq("id", id);
  return { data, error };
}

/**
 * Delete a family member record.
 * @param {string} id - The family member's id.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function deleteFamily(id) {
  const { data, error } = await supabase.from("family").delete().eq("id", id);
  return { data, error };
}
