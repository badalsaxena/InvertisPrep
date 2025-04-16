import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Backend URL - can be moved to environment variable
const BACKEND_URL = "https://invertisprepbackend.vercel.app";

// Define program data with branches
const programsData = {
  btech: {
    name: "BTech",
    fullName: "Bachelor of Technology",
    branches: [
      { id: "cse", name: "Computer Science Engineering" },
      { id: "ai", name: "Artificial Intelligence" },
      { id: "me", name: "Mechanical Engineering" },
      { id: "ee", name: "Electrical Engineering" },
      { id: "ce", name: "Civil Engineering" }
    ]
  },
  bca: {
    name: "BCA",
    fullName: "Bachelor of Computer Applications",
    branches: [
      { id: "general", name: "General" }
    ]
  },
  mca: {
    name: "MCA",
    fullName: "Master of Computer Applications",
    branches: [
      { id: "general", name: "General" }
    ]
  },
  mtech: {
    name: "MTech",
    fullName: "Master of Technology",
    branches: [
      { id: "cse", name: "Computer Science Engineering" },
      { id: "ee", name: "Electrical Engineering" }
    ]
  },
  bba: {
    name: "BBA",
    fullName: "Bachelor of Business Administration",
    branches: [
      { id: "general", name: "General" }
    ]
  },
  mba: {
    name: "MBA",
    fullName: "Master of Business Administration",
    branches: [
      { id: "general", name: "General" }
    ]
  }
};

// Interface for paper data
interface Paper {
  id: string;
  title: string;
  path: string;
  filename: string;
  semester: string;
  session: string;
  department: string;
  branch: string;
}

function ProgramDetails() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  
  const [branches, setBranches] = useState<Array<{ id: string, name: string }>>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  
  const [searchResults, setSearchResults] = useState<Paper[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchingOptions, setFetchingOptions] = useState<boolean>(false);
  
  // Validate program ID
  const program = programId && programsData[programId as keyof typeof programsData];
  
  // Fetch branches for the selected department/program
  useEffect(() => {
    if (!programId) return;
    
    const fetchBranches = async () => {
      setFetchingOptions(true);
      try {
        // Using the API endpoint described in the documentation
        const response = await fetch(`${BACKEND_URL}/api/resources/departments/${programId}/branches`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch branches: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Fetched branches for ${programId}:`, data);
        
        if (data.branches && Array.isArray(data.branches)) {
          setBranches(data.branches);
          // Auto-select if only one branch
          if (data.branches.length === 1) {
            setSelectedBranch(data.branches[0].id);
          }
        } else {
          setBranches([]);
        }
      } catch (err) {
        console.error(`Error fetching branches for ${programId}:`, err);
        // Fallback to safer approach
        if (program && typeof programId === 'string' && programId in programsData) {
          setBranches(programsData[programId as keyof typeof programsData].branches);
        } else {
          setBranches([]);
        }
      } finally {
        setFetchingOptions(false);
      }
    };
    
    fetchBranches();
  }, [programId, program]);
  
  // Fetch semesters when branch is selected
  useEffect(() => {
    if (!programId || !selectedBranch) return;
    
    const fetchSemesters = async () => {
      setFetchingOptions(true);
      try {
        // Using the API endpoint described in the documentation
        const response = await fetch(`${BACKEND_URL}/api/resources/departments/${programId}/branches/${selectedBranch}/semesters`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch semesters: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Fetched semesters for ${programId}/${selectedBranch}:`, data);
        
        if (data.semesters && Array.isArray(data.semesters)) {
          setSemesters(data.semesters);
        } else {
          setSemesters([]);
        }
      } catch (err) {
        console.error(`Error fetching semesters:`, err);
        // Fallback to generic semesters based on program and branch
        if (selectedBranch === "ai" && programId === "btech") {
          // Specific fallback for BTech AI
          setSemesters(["1", "2", "3", "4", "5", "6", "7", "8"]);
          console.log("Using fallback semesters for BTech AI");
        } else {
          const defaultSemesters = programId === "btech" 
            ? Array.from({ length: 8 }, (_, i) => (i + 1).toString())
            : programId === "bca" || programId === "bba"
              ? Array.from({ length: 6 }, (_, i) => (i + 1).toString())
              : Array.from({ length: 4 }, (_, i) => (i + 1).toString());
          
          setSemesters(defaultSemesters);
        }
      } finally {
        setFetchingOptions(false);
      }
    };
    
    fetchSemesters();
  }, [programId, selectedBranch]);
  
  // Fetch sessions when branch is selected
  useEffect(() => {
    if (!programId || !selectedBranch) return;
    
    const fetchSessions = async () => {
      setFetchingOptions(true);
      try {
        // Using the API endpoint described in the documentation
        const response = await fetch(`${BACKEND_URL}/api/resources/departments/${programId}/branches/${selectedBranch}/sessions`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch sessions: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Fetched sessions for ${programId}/${selectedBranch}:`, data);
        
        if (data.sessions && Array.isArray(data.sessions)) {
          setSessions(data.sessions);
          // Auto-select if only one session
          if (data.sessions.length === 1) {
            setSelectedSession(data.sessions[0]);
          }
        } else {
          setSessions([]);
        }
      } catch (err) {
        console.error(`Error fetching sessions:`, err);
        // Fallback to default sessions with better handling for AI branch
        const defaultSessions = ["2023-24", "2022-23", "2021-22", "2020-21"];
        
        // Special handling for AI branch based on screenshot
        if (selectedBranch === "ai" && programId === "btech") {
          console.log("Using fallback sessions for BTech AI");
          setSelectedSession("2023-24"); // Pre-select first session based on your screenshot
        }
        
        setSessions(defaultSessions);
      } finally {
        setFetchingOptions(false);
      }
    };
    
    fetchSessions();
  }, [programId, selectedBranch]);
  
  // Reset results when selections change
  useEffect(() => {
    setSearchResults([]);
    setError(null);
  }, [selectedBranch, selectedSemester, selectedSession]);
  
  if (!program) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Program</h1>
        <p className="mb-6">The requested program does not exist.</p>
        <Button onClick={() => navigate("/pyq")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </Button>
      </div>
    );
  }
  
  const handleSearch = async () => {
    if (!selectedBranch || !selectedSemester || !selectedSession) {
      setError("Please select all options to search for papers.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Using the API endpoint described in the documentation for files
      const queryParams = new URLSearchParams({
        department: programId || '',
        branch: selectedBranch,
        semester: selectedSemester,
        session: selectedSession
      });
      
      const apiUrl = `${BACKEND_URL}/api/resources/files?${queryParams.toString()}`;
      console.log("Requesting files from:", apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      // Parse the response
      let data;
      try {
        const text = await response.text();
        if (text.includes('<!doctype') || text.includes('<html')) {
          throw new Error("Unexpected token '<', \"<!doctype \"... is not valid JSON");
        }
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error("JSON parsing error:", parseErr);
        throw new Error(`Failed to parse response: ${parseErr instanceof Error ? parseErr.message : 'Unknown error'}`);
      }
      
      console.log("Fetched papers:", data);
      
      if (data.files && Array.isArray(data.files) && data.files.length > 0) {
        setSearchResults(data.files);
      } else {
        setSearchResults([]);
        setError("No papers found for your selection.");
      }
    } catch (err) {
      console.error("Error fetching papers:", err);
      setError(`Failed to load papers: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Format the semester for display
  const formatSemester = (semesterId: string) => {
    return `Semester ${semesterId}`;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/pyq")}
            className="mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Button>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-3">
          {program.name}
        </h1>
        <p className="text-lg text-gray-600">
          {program.fullName} Previous Year Question Papers
        </p>
      </div>
      
      {/* Selection Form */}
      <Card className="max-w-3xl mx-auto shadow-md border border-gray-200 mb-8">
        <CardHeader>
          <CardTitle>Find Question Papers</CardTitle>
          <CardDescription>
            Select branch, semester, and session to find question papers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Branch Selection */}
            <div className="space-y-2">
              <label htmlFor="branch" className="font-medium text-sm text-gray-700">
                Branch
              </label>
              <Select
                value={selectedBranch}
                onValueChange={setSelectedBranch}
                disabled={fetchingOptions}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fetchingOptions && selectedBranch === "" && (
                <p className="text-xs text-blue-600">Loading branches...</p>
              )}
            </div>
            
            {/* Session Selection */}
            <div className="space-y-2">
              <label htmlFor="session" className="font-medium text-sm text-gray-700">
                Session
              </label>
              <Select
                value={selectedSession}
                onValueChange={setSelectedSession}
                disabled={!selectedBranch || fetchingOptions}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session} value={session}>
                      {session}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fetchingOptions && selectedBranch !== "" && selectedSession === "" && (
                <p className="text-xs text-blue-600">Loading sessions...</p>
              )}
            </div>
            
            {/* Semester Selection */}
            <div className="space-y-2">
              <label htmlFor="semester" className="font-medium text-sm text-gray-700">
                Semester
              </label>
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
                disabled={!selectedBranch || fetchingOptions}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {formatSemester(semester)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fetchingOptions && selectedBranch !== "" && selectedSemester === "" && (
                <p className="text-xs text-blue-600">Loading semesters...</p>
              )}
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSearch}
            disabled={loading || !selectedBranch || !selectedSemester || !selectedSession || fetchingOptions}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search Papers"
            )}
          </Button>
        </CardContent>
      </Card>
      
      {/* Results */}
      {searchResults.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Available Question Papers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((paper) => (
              <Card key={paper.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {paper.title || paper.filename.replace('.pdf', '')}
                  </CardTitle>
                  <CardDescription>
                    {formatSemester(paper.semester)} | {paper.session}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-end">
                    <a 
                      href={`${BACKEND_URL}${paper.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* No Results Message */}
      {searchResults.length === 0 && !loading && selectedBranch && selectedSemester && selectedSession && !error && (
        <div className="max-w-xl mx-auto text-center p-8 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No Question Papers Found</h3>
          <p className="text-gray-600">
            We couldn't find any question papers matching your selections.
            Try a different combination of branch, semester, and session.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProgramDetails; 