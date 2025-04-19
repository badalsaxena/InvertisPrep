import React, { useEffect } from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'CollegeOrUniversity' | 'FAQPage' | 'Article';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    // Create the JSON-LD script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `structured-data-${type.toLowerCase()}`;
    
    // Base data for each type
    let structuredData: any = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };

    // Set the script content
    script.innerHTML = JSON.stringify(structuredData);
    
    // Remove any existing structured data of this type to avoid duplicates
    const existingScript = document.getElementById(`structured-data-${type.toLowerCase()}`);
    if (existingScript) {
      existingScript.remove();
    }
    
    // Add the script to the document head
    document.head.appendChild(script);
    
    // Cleanup
    return () => {
      // Remove the script when the component unmounts
      const scriptToRemove = document.getElementById(`structured-data-${type.toLowerCase()}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);
  
  // This component doesn't render anything visibly
  return null;
} 