import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, Loader2 } from "lucide-react";

interface Semester {
  id: string;
  name: string;
  description: string;
}

interface SemesterWizardProps {
  department: string;
  branch: string;
  onNext: (semester: string) => void;
  onBack: () => void;
}

const SemesterWizard: React.FC<SemesterWizardProps> = ({ department, branch, onNext, onBack }) => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch semesters when department and branch are provided
  useEffect(() => {
    const fetchSemesters = async () => {
      if (!department || !branch) return;
      
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/departments/${department}/branches/${branch}/semesters`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch semesters: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Fetched semesters for ${department}/${branch}:`, data);
        
        // Log raw semester data to help debug the issue with BTech AI
        console.log('Raw semester data:', data);
        
        // Transform the data into the expected format with detailed logging
        const formattedSemesters = data.map((semester: string | number) => {
          // Ensure semester is treated as a string
          const semesterStr = String(semester);
          console.log(`Processing semester: ${semesterStr}, type: ${typeof semester}`);
          
          // Extract semester number if it's in format like "semester1"
          let semesterName = semesterStr;
          let semesterNumber = semesterStr;
          
          if (semesterStr.toLowerCase().startsWith('semester')) {
            semesterNumber = semesterStr.replace(/[^0-9]/g, '');
            semesterName = `Semester ${semesterNumber}`;
          } else if (!isNaN(Number(semesterStr))) {
            // If it's just a number, format it as "Semester X"
            semesterName = `Semester ${semesterStr}`;
          }
          
          console.log(`Formatted semester: ${semesterName}, id: ${semesterStr}`);
          
          return {
            id: semesterStr,
            name: semesterName,
            description: `${department.toUpperCase()} ${branch.toUpperCase()} - ${semesterName}`
          };
        });
        
        console.log('Formatted semesters:', formattedSemesters);
        setSemesters(formattedSemesters);
        
        // If there's only one semester, auto-select it
        if (formattedSemesters.length === 1) {
          setSelectedSemester(formattedSemesters[0].id);
        }
      } catch (err) {
        console.error(`Error fetching semesters for ${department}/${branch}:`, err);
        setError('Failed to load semesters. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSemesters();
  }, [department, branch]);

  const handleSemesterSelect = (semesterId: string) => {
    console.log('Selected semester:', semesterId);
    setSelectedSemester(semesterId);
  };

  const handleNext = () => {
    if (!selectedSemester) {
      return;
    }
    
    console.log('Proceeding with semester:', selectedSemester);
    onNext(selectedSemester);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[300px] gap-4">
        <p className="text-red-500">{error}</p>
        <Button 
          variant="default" 
          onClick={() => {
            if (department && branch) {
              // Retry fetching semesters
              setLoading(true);
              const fetchSemesters = async () => {
                // Implementation will be re-triggered by the useEffect
              };
              fetchSemesters();
            }
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Select Semester
      </h2>
      
      {semesters.length === 0 ? (
        <div className="text-center py-4">
          <p className="mb-2">
            No semesters found for {branch.toUpperCase()} branch in {department.toUpperCase()} department.
          </p>
          <p className="text-gray-500 text-sm mb-4">
            There might be no data available yet, or there could be an issue with the server.
          </p>
          <Button variant="default" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {semesters.map((semester) => (
            <Card 
              key={semester.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedSemester === semester.id 
                  ? 'border-2 border-primary' 
                  : 'border border-gray-200'
              }`}
              onClick={() => handleSemesterSelect(semester.id)}
            >
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    {semester.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {semester.description}
                  </p>
                </div>
                {selectedSemester === semester.id && (
                  <CheckIcon className="h-5 w-5 text-primary" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          variant="default" 
          disabled={!selectedSemester} 
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SemesterWizard; 