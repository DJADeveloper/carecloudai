// /lib/actions/Events.js
import { supabase } from "@/app/lib/supabase";

export async function createEvent(eventData) {
  const { data, error } = await supabase.from("events").insert([eventData]);
  return { data, error };
}

export async function getEvent(id) {
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
  return { data, error };
}

export async function listEvents(filters = {}, range = { start: 0, end: 9 }) {
  const { data, error, count } = await supabase
    .from("events")
    .select("*", { count: "exact" })
    .match(filters)
    .range(range.start, range.end);
  return { data, count, error };
}

export async function updateEvent(id, eventData) {
  const { data, error } = await supabase.from("events").update(eventData).eq("id", id);
  return { data, error };
}

export async function deleteEvent(id) {
  const { data, error } = await supabase.from("events").delete().eq("id", id);
  return { data, error };
}
