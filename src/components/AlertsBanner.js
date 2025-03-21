import React, { useState, useEffect } from "react";


function AlertsBanner() {
    const [unresolvedIncidents, setUnresolvedIncidents] = useState(0);
  
    useEffect(() => {
      // Example fetch. Replace with real data if needed.
      setUnresolvedIncidents(2);
    }, []);
  
    if (unresolvedIncidents === 0) return null;
  
    return (
      <div className="w-full mb-4 border-l-4 border-red-500 bg-red-50 p-3 rounded-r text-red-700">
        <p className="text-sm font-medium">
          Alert: There {unresolvedIncidents === 1 ? "is" : "are"}{" "}
          {unresolvedIncidents} unresolved incident
          {unresolvedIncidents > 1 ? "s" : ""} that require attention!
        </p>
      </div>
    );
  }

  export default AlertsBanner;