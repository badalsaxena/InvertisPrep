import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, Loader2 } from "lucide-react";

interface Department {
  id: string;
  name: string;
  description: string;
}

interface Branch {
  id: string;
  name: string;
  description: string;
}

interface DepartmentWizardProps {
  onNext: (department: string, branch: string) => void;
  onBack?: () => void;
}

const DepartmentWizard: React.FC<DepartmentWizardProps> = ({ onNext, onBack }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [step, setStep] = useState<'department' | 'branch'>('department');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/departments');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched departments:', data);
        
        // Transform the data into the expected format
        const formattedDepartments = data.map((dept: string) => ({
          id: dept.toLowerCase(),
          name: dept.toUpperCase(),
          description: `${dept.toLowerCase()} department resources`
        }));
        
        setDepartments(formattedDepartments);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();
  }, []);

  // Fetch branches when a department is selected
  useEffect(() => {
    if (!selectedDepartment) return;
    
    const fetchBranches = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/departments/${selectedDepartment}/branches`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch branches: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Fetched branches for ${selectedDepartment}:`, data);
        
        // Transform the data into the expected format
        const formattedBranches = data.map((branch: string) => ({
          id: branch.toLowerCase(),
          name: branch.toUpperCase(),
          description: `${branch.toLowerCase()} branch resources`
        }));
        
        setBranches(formattedBranches);
        
        // If there's only one branch, auto-select it and move to next step
        if (formattedBranches.length === 1) {
          setSelectedBranch(formattedBranches[0].id);
          // If you want to automatically proceed when there's only one branch, uncomment below
          // handleNext();
        }
      } catch (err) {
        console.error(`Error fetching branches for ${selectedDepartment}:`, err);
        setError('Failed to load branches. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBranches();
  }, [selectedDepartment]);

  const handleDepartmentSelect = (departmentId: string) => {
    console.log('Selected department:', departmentId);
    setSelectedDepartment(departmentId);
    setSelectedBranch(null); // Reset branch selection
    setStep('branch');
  };

  const handleBranchSelect = (branchId: string) => {
    console.log('Selected branch:', branchId);
    setSelectedBranch(branchId);
  };

  const handleNext = () => {
    if (!selectedDepartment || !selectedBranch) {
      return;
    }
    
    console.log('Proceeding with:', { department: selectedDepartment, branch: selectedBranch });
    onNext(selectedDepartment, selectedBranch);
  };

  const handleBack = () => {
    if (step === 'branch') {
      setStep('department');
      setSelectedBranch(null);
    } else if (onBack) {
      onBack();
    }
  };

  // Render loading state
  if (loading && !departments.length) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render error state
  if (error && !departments.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[300px] gap-4">
        <p className="text-red-500">{error}</p>
        <Button 
          variant="default" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {step === 'department' ? (
        <>
          <h2 className="text-2xl font-bold mb-4">
            Select Department
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((department) => (
              <Card 
                key={department.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedDepartment === department.id 
                    ? 'border-2 border-primary' 
                    : 'border border-gray-200'
                }`}
                onClick={() => handleDepartmentSelect(department.id)}
              >
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {department.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {department.description}
                    </p>
                  </div>
                  {selectedDepartment === department.id && (
                    <CheckIcon className="h-5 w-5 text-primary" />
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-between mt-8">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
            )}
            <div></div> {/* Spacer for flex layout */}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">
            Select Branch
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center min-h-[200px] gap-4">
              <p className="text-red-500">{error}</p>
              <Button 
                variant="default" 
                onClick={() => {
                  if (selectedDepartment) {
                    // Retry fetching branches
                    setSelectedDepartment(selectedDepartment);
                  }
                }}
              >
                Retry
              </Button>
            </div>
          ) : branches.length === 0 ? (
            <p className="text-center py-4">No branches available for this department.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map((branch) => (
                <Card 
                  key={branch.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedBranch === branch.id 
                      ? 'border-2 border-primary' 
                      : 'border border-gray-200'
                  }`}
                  onClick={() => handleBranchSelect(branch.id)}
                >
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {branch.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {branch.description}
                      </p>
                    </div>
                    {selectedBranch === branch.id && (
                      <CheckIcon className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button 
              variant="default" 
              disabled={!selectedBranch} 
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DepartmentWizard; 