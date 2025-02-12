// /lib/actions/Incidents.js
import { supabase } from "@/app/lib/supabase";

/**
 * Create a new incident record.
 * @param {Object} incidentData - The incident data to insert.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function createIncident(incidentData) {
  const { data, error } = await supabase
    .from("incidents")
    .insert([incidentData]);
  return { data, error };
}

/**
 * Retrieve a single incident record by id.
 * @param {string} id - The incident record's id.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function getIncident(id) {
  const { data, error } = await supabase
    .from("incidents")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
}

/**
 * List incident records with optional filters and pagination.
 * @param {Object} [filters={}] - Filtering conditions.
 * @param {Object} [range={ start: 0, end: 9 }] - Pagination range.
 * @returns {Promise<{data: any, count: number, error: any}>}
 */
export async function listIncidents(filters = {}, range = { start: 0, end: 9 }) {
  const { data, error, count } = await supabase
    .from("incidents")
    .select("*", { count: "exact" })
    .match(filters)
    .range(range.start, range.end);
  return { data, count, error };
}

/**
 * Update an existing incident record.
 * @param {string} id - The incident record's id.
 * @param {Object} incidentData - The updated incident data.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function updateIncident(id, incidentData) {
  const { data, error } = await supabase
    .from("incidents")
    .update(incidentData)
    .eq("id", id);
  return { data, error };
}

/**
 * Delete an incident record by id.
 * @param {string} id - The incident record's id.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function deleteIncident(id) {
  const { data, error } = await supabase
    .from("incidents")
    .delete()
    .eq("id", id);
  return { data, error };
}
