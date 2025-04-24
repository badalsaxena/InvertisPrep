import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export const VisitorCounter = () => {
  const [visits, setVisits] = useState(0);

  // Loading from localStorage
  useEffect(() => {
    // Get stored visits or start with 953
    const storedVisits = Number(localStorage.getItem("visitCounter")) || 953;
    // Always increment by 1 on each page load
    setVisits(storedVisits + 1);
  }, []);

  // Saving in localStorage
  useEffect(() => {
    if (visits > 0) {
      localStorage.setItem("visitCounter", String(visits));
    }
  }, [visits]);
  
  return (
    <div className="visitor-counter-container">
      <div 
        className="counter-display"
        style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Users className="h-4 w-4 mr-2 text-indigo-300" />
        <span className="text-xs font-medium text-white">{visits.toLocaleString()} Visitors</span>
      </div>
    </div>
  );
}; 