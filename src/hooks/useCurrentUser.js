// src/hooks/useCurrentUser.js

"use client";
import { supabase } from "@/app/lib/supabase";
import { useEffect, useState, useCallback } from "react";

export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbData, setDbData] = useState({
    residents: [],
    families: [],
    events: [],
    medications: [],
    incidents: [],
    staff: [],
  });

  const fetchData = useCallback(async () => {
    try {
      console.log('Fetching data started...');
      const tables = ['residents', 'family', 'events', 'medications', 'incidents', 'staff'];
      
      const results = await Promise.all(
        tables.map(async table => {
          const { data, error } = await supabase.from(table).select('*');
          if (error) {
            console.error(`Error fetching ${table}:`, error);
            throw error;
          }
          console.log(`${table} data:`, data?.length || 0, 'records');
          return { [table]: data || [] };
        })
      );

      const newData = Object.assign({}, ...results);
      console.log('Setting new data:', Object.keys(newData).map(k => `${k}: ${newData[k].length}`));
      setDbData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        console.log('Getting session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          return;
        }
        
        console.log('Session retrieved:', session ? 'Yes' : 'No');
        
        if (!mounted) {
          console.log('Component unmounted during initialization');
          return;
        }

        if (session?.user) {
          console.log('Setting user:', session.user.email);
          setUser(session.user);
          await fetchData();
        } else {
          console.log('No user in session');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error during initialization:', error);
        if (mounted) setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        if (!mounted) return;

        const newUser = session?.user || null;
        setUser(newUser);
          
        if (newUser && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await fetchData();
        }
      }
    );

    initialize();

    return () => {
      console.log('Cleanup running');
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchData]);

  return {
    user,
    loading,
    dbData,
    refreshData: fetchData
  };
}
