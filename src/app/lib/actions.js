import { supabase } from "@/app/lib/supabase";

/**
 * Generic function to create a record in a given table.
 * @param {string} table - The table name.
 * @param {Object} recordData - The data for the new record.
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function createRecord(table, recordData) {
  const { data, error } = await supabase.from(table).insert([recordData]).single();
  return { data, error };
}

/**
 * Generic function to read records from a table.
 * @param {string} table - The table name.
 * @param {Object} [options] - Additional options for the select query.
 *   Example: { select: "*", options: { count: "exact" }, filters: { field: value } }
 * @returns {Promise<{ data: any, error: any, count: number }>}
 */
export async function readRecords(table, options = {}) {
  const selectClause = options.select || "*";
  let query = supabase.from(table).select(selectClause, options.options);
  if (options.filters) {
    Object.entries(options.filters).forEach(([field, condition]) => {
      // For simplicity, assume condition is an object with an operator key.
      // E.g., { contains: value } or { eq: value }
      const operator = Object.keys(condition)[0];
      const value = condition[operator];
      if (operator === "contains") {
        query = query.ilike(field, `%${value}%`);
      } else if (operator === "eq") {
        query = query.eq(field, value);
      }
      // Add more operators as needed.
    });
  }
  const { data, error, count } = await query;
  return { data, error, count };
}

/**
 * Generic function to update a record in a given table.
 * @param {string} table - The table name.
 * @param {string|number} recordId - The ID of the record to update.
 * @param {Object} recordData - The new data for the record.
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function updateRecord(table, recordId, recordData) {
  const { data, error } = await supabase.from(table).update(recordData).eq("id", recordId).single();
  return { data, error };
}

/**
 * Generic function to delete a record from a given table.
 * @param {string} table - The table name.
 * @param {string|number} recordId - The ID of the record to delete.
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function deleteRecord(table, recordId) {
  const { data, error } = await supabase.from(table).delete().eq("id", recordId);
  return { data, error };
}

/* --- Specific Entity Actions --- */

// Family Member
export async function createFamilyMember(recordData) {
  return await createRecord("family", recordData);
}
export async function readFamilyMembers(options) {
  return await readRecords("family", options);
}
export async function updateFamilyMember(id, recordData) {
  return await updateRecord("family", id, recordData);
}
export async function deleteFamilyMember(id) {
  return await deleteRecord("family", id);
}

// Resident
export async function createResident(recordData) {
  return await createRecord("residents", recordData);
}
export async function readResidents(options) {
  return await readRecords("residents", options);
}
export async function updateResident(id, recordData) {
  return await updateRecord("residents", id, recordData);
}
export async function deleteResident(id) {
  return await deleteRecord("residents", id);
}

// Staff
export async function createStaff(recordData) {
  return await createRecord("staff", recordData);
}
export async function readStaff(options) {
  return await readRecords("staff", options);
}
export async function updateStaff(id, recordData) {
  return await updateRecord("staff", id, recordData);
}
export async function deleteStaff(id) {
  return await deleteRecord("staff", id);
}

// Room
export async function createRoom(recordData) {
  return await createRecord("rooms", recordData);
}
export async function readRooms(options) {
  return await readRecords("rooms", options);
}
export async function updateRoom(id, recordData) {
  return await updateRecord("rooms", id, recordData);
}
export async function deleteRoom(id) {
  return await deleteRecord("rooms", id);
}

// Care Plan
export async function createCarePlan(recordData) {
  return await createRecord("careplans", recordData);
}
export async function readCarePlans(options) {
  return await readRecords("careplans", options);
}
export async function updateCarePlan(id, recordData) {
  return await updateRecord("careplans", id, recordData);
}
export async function deleteCarePlan(id) {
  return await deleteRecord("careplans", id);
}

// Medical Record
export async function createMedicalRecord(recordData) {
  return await createRecord("medicalrecords", recordData);
}
export async function readMedicalRecords(options) {
  return await readRecords("medicalrecords", options);
}
export async function updateMedicalRecord(id, recordData) {
  return await updateRecord("medicalrecords", id, recordData);
}
export async function deleteMedicalRecord(id) {
  return await deleteRecord("medicalrecords", id);
}

// Care Routine
export async function createCareRoutine(recordData) {
  return await createRecord("careroutines", recordData);
}
export async function readCareRoutines(options) {
  return await readRecords("careroutines", options);
}
export async function updateCareRoutine(id, recordData) {
  return await updateRecord("careroutines", id, recordData);
}
export async function deleteCareRoutine(id) {
  return await deleteRecord("careroutines", id);
}

// Event
export async function createEvent(recordData) {
  return await createRecord("events", recordData);
}
export async function readEvents(options) {
  return await readRecords("events", options);
}
export async function updateEvent(id, recordData) {
  return await updateRecord("events", id, recordData);
}
export async function deleteEvent(id) {
  return await deleteRecord("events", id);
}

// Announcement
export async function createAnnouncement(recordData) {
  return await createRecord("announcements", recordData);
}
export async function readAnnouncements(options) {
  return await readRecords("announcements", options);
}
export async function updateAnnouncement(id, recordData) {
  return await updateRecord("announcements", id, recordData);
}
export async function deleteAnnouncement(id) {
  return await deleteRecord("announcements", id);
}
