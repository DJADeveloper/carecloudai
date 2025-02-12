// /lib/actions/Medications.js
import { supabase } from "@/app/lib/supabase";

/**
 * Create a new medication record.
 * @param {Object} medData - The medication data to insert.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function createMedication(medData) {
  const { data, error } = await supabase
    .from("medications")
    .insert([medData]);
  return { data, error };
}

/**
 * Retrieve a single medication record by id.
 * @param {string} id - The medication record's id.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function getMedication(id) {
  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
}

/**
 * List medication records with optional filters and pagination.
 * @param {Object} [filters={}] - Filtering conditions.
 * @param {Object} [range={ start: 0, end: 9 }] - Pagination range.
 * @returns {Promise<{data: any, count: number, error: any}>}
 */
export async function listMedications(filters = {}, range = { start: 0, end: 9 }) {
  const { data, error, count } = await supabase
    .from("medications")
    .select("*", { count: "exact" })
    .match(filters)
    .range(range.start, range.end);
  return { data, count, error };
}

/**
 * Update an existing medication record.
 * @param {string} id - The medication record's id.
 * @param {Object} medData - The updated medication data.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function updateMedication(id, medData) {
  const { data, error } = await supabase
    .from("medications")
    .update(medData)
    .eq("id", id);
  return { data, error };
}

/**
 * Delete a medication record by id.
 * @param {string} id - The medication record's id.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function deleteMedication(id) {
  const { data, error } = await supabase
    .from("medications")
    .delete()
    .eq("id", id);
  return { data, error };
}
