import React, { useState } from 'react';
import SelectionForm from './SelectionForm';

interface PYQBrowserProps {
  // Add any props you need
}

const PYQBrowser: React.FC<PYQBrowserProps> = () => {
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (department: string, branch: string, semester: string, session?: string) => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      // Construct the API endpoint based on the selected filters
      let endpoint = `/api/papers/${department}/${branch}/${semester}`;
      if (session) {
        endpoint += `/${session}`;
      }
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch papers: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched papers:', data);
      setResults(data);
      
      if (data.length === 0) {
        setError('No papers found for the selected criteria.');
      }
    } catch (err) {
      console.error('Error fetching papers:', err);
      setError('Failed to load papers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <SelectionForm onSubmit={handleFormSubmit} />
      
      {loading && (
        <div className="flex justify-center items-center mt-8 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && !loading && (
        <div className="mt-8 p-4 border border-red-200 rounded-md bg-red-50">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}
      
      {results && results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Available Papers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((paper, index) => (
              <div key={index} className="border rounded-md p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium mb-2">{paper.title || `Paper ${index + 1}`}</h4>
                {paper.description && (
                  <p className="text-sm text-gray-600 mb-3">{paper.description}</p>
                )}
                <a 
                  href={paper.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PYQBrowser; 