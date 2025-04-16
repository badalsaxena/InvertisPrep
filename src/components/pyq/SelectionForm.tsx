import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SelectionFormProps {
  onSubmit: (department: string, branch: string, semester: string, session?: string) => void;
}

const SelectionForm: React.FC<SelectionFormProps> = ({ onSubmit }) => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for testing - replace with actual API calls
  useEffect(() => {
    // Simulating API call for departments
    setDepartments(['cse', 'ee', 'me', 'ce', 'ai']);
  }, []);

  useEffect(() => {
    if (!selectedDepartment) {
      setBranches([]);
      return;
    }
    
    // Simulating API call for branches
    if (selectedDepartment === 'cse') {
      setBranches(['btech', 'mtech', 'phd']);
    } else if (selectedDepartment === 'ee') {
      setBranches(['btech', 'mtech']);
    } else if (selectedDepartment === 'ai') {
      setBranches(['btech']);
    } else {
      setBranches(['btech']);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (!selectedDepartment || !selectedBranch) {
      setSemesters([]);
      return;
    }
    
    // Simulating API call for semesters
    setSemesters(['semester1', 'semester2', 'semester3', 'semester4', 'semester5', 'semester6', 'semester7', 'semester8']);
  }, [selectedDepartment, selectedBranch]);

  useEffect(() => {
    if (!selectedDepartment || !selectedBranch || !selectedSemester) {
      setSessions([]);
      return;
    }
    
    // Simulating API call for sessions
    setSessions(['2022-23', '2021-22', '2020-21']);
  }, [selectedDepartment, selectedBranch, selectedSemester]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDepartment && selectedBranch && selectedSemester) {
      onSubmit(selectedDepartment, selectedBranch, selectedSemester, selectedSession);
    }
  };

  const formatOptionLabel = (value: string, type: 'department' | 'branch' | 'semester' | 'session') => {
    if (!value) return "Select";
    
    switch (type) {
      case 'department':
        return value.toUpperCase();
      case 'branch':
        return value.toUpperCase();
      case 'semester':
        // If semester is in format like "semester1", extract the number
        if (value.toLowerCase().startsWith('semester')) {
          const semNumber = value.replace(/[^0-9]/g, '');
          return `Semester ${semNumber}`;
        } else if (!isNaN(Number(value))) {
          return `Semester ${value}`;
        }
        return value;
      case 'session':
        return value;
      default:
        return value;
    }
  };

  if (loading && !departments.length) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
    <div className="w-full max-w-4xl mx-auto p-6 border rounded-lg shadow-sm bg-white">
      <div className="mb-3 text-red-600 font-medium text-center">
        Note: Before downloading any previous year papers, please check your current syllabus.
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          <div className="flex flex-col">
            <label htmlFor="department" className="font-medium mb-2">
              Select Programme
            </label>
            <select
              id="department"
              className="border rounded-md p-2"
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setSelectedBranch("");
                setSelectedSemester("");
                setSelectedSession("");
              }}
              required
            >
              <option value="">Select</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {formatOptionLabel(dept, 'department')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="branch" className="font-medium mb-2">
              Select Branch
            </label>
            <select
              id="branch"
              className="border rounded-md p-2"
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setSelectedSemester("");
                setSelectedSession("");
              }}
              disabled={!selectedDepartment || loading}
              required
            >
              <option value="">Select</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {formatOptionLabel(branch, 'branch')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="semester" className="font-medium mb-2">
              Select Semester
            </label>
            <select
              id="semester"
              className="border rounded-md p-2"
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setSelectedSession("");
              }}
              disabled={!selectedBranch || loading}
              required
            >
              <option value="">Select</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {formatOptionLabel(semester, 'semester')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="session" className="font-medium mb-2">
              Select Session
            </label>
            <select
              id="session"
              className="border rounded-md p-2"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              disabled={!selectedSemester || loading}
              required
            >
              <option value="">Select</option>
              {sessions.map((session) => (
                <option key={session} value={session}>
                  {formatOptionLabel(session, 'session')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            variant="default"
            disabled={loading || !(selectedDepartment && selectedBranch && selectedSemester && selectedSession)}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-2 text-white font-semibold w-full"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SelectionForm; 