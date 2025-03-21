"use client";

import React, { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import { useCurrentUser } from "@/context/UserContext";
import { supabase } from "@/app/lib/supabase";

const FormContainer =({ table, type, data, id }) =>{
  const { user } = useCurrentUser();
  const [relatedData, setRelatedData] = useState({});

  useEffect(() => {
    async function fetchData() {
      if (type !== "delete") {
        switch (table) {
          case "staff":
            setRelatedData({ roles: ["ADMIN", "NURSE", "CAREGIVER"] });
            break;
          case "resident": {
            const { data: residentRooms, error: roomError } =
              await supabase.from("rooms").select("id, name");
            const { data: residentFamilies, error: familyError } =
              await supabase.from("family").select("id, name, surname");
            if (roomError) console.error("Rooms error:", roomError.message);
            if (familyError)
              console.error("Family error:", familyError.message);
            setRelatedData({
              rooms: residentRooms || [],
              families: residentFamilies || [],
            });
            break;
          }
          case "family": {
            const { data: associatedResidents, error } =
              await supabase.from("residents").select("id, fullname");
            if (error)
              console.error(
                "Error fetching associated residents:",
                error.message
              );
            setRelatedData({ residents: associatedResidents || [] });
            break;
          }
          case "room": {
            const { data: routinesForRooms, error } =
              await supabase.from("careroutines").select("id, name");
            if (error)
              console.error(
                "Error fetching routines for rooms:",
                error.message
              );
            setRelatedData({ routines: routinesForRooms || [] });
            break;
          }
          case "carePlan":
          case "medicalRecord": {
            const { data: associatedResidentsForPlans, error } =
              await supabase.from("residents").select("id, fullname");
            if (error)
              console.error(
                "Error fetching residents for plans:",
                error.message
              );
            setRelatedData({ residents: associatedResidentsForPlans || [] });
            break;
          }
          case "careRoutine": {
            const { data: roomOptions, error } =
              await supabase.from("rooms").select("id, name");
            if (error)
              console.error("Error fetching room options:", error.message);
            setRelatedData({ rooms: roomOptions || [] });
            break;
          }
          case "event":
          case "announcement": {
            const { data: availableRooms, error } =
              await supabase.from("rooms").select("id, name");
            if (error)
              console.error(
                "Error fetching available rooms:",
                error.message
              );
            setRelatedData({ rooms: availableRooms || [] });
            break;
          }
          case "assessment": {
            const { data: residentsForAssessment, error: resError } =
              await supabase.from("residents").select("id, fullname");
            const { data: careProviders, error: staffError } =
              await supabase
                .from("staff")
                .select("id, name, surname")
                .eq("role", "CAREGIVER");
            const { data: relatedPlans, error: planError } =
              await supabase.from("careplans").select("id, title");
            if (resError)
              console.error(
                "Error fetching residents for assessments:",
                resError.message
              );
            if (staffError)
              console.error(
                "Error fetching care providers:",
                staffError.message
              );
            if (planError)
              console.error("Error fetching care plans:", planError.message);
            setRelatedData({
              residents: residentsForAssessment || [],
              careProviders: careProviders || [],
              carePlans: relatedPlans || [],
            });
            break;
          }
          default:
            setRelatedData({});
            break;
        }
      }
    }
    fetchData();
  }, [table, type]);

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
}

export default React.memo(FormContainer);
