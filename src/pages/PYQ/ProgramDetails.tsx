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
import { ChevronLeft, FileText, Loader2, Download, Search, BookOpen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import AuthRequiredDialog from "@/components/AuthRequiredDialog";

// Backend URLs - can be moved to environment variables
const BACKEND_URL = "https://invertisprepbackend.onrender.com";
const VERCEL_BACKEND_URL = "https://invertisprepbackend.vercel.app";

// Helper function to try different backend URLs
const fetchWithFallback = async (path: string) => {
  try {
    // Try Render backend first
    const response = await fetch(`${BACKEND_URL}${path}`);
    if (response.ok) {
      return response;
    }
    
    console.log(`Render backend failed for: ${path}, trying Vercel`);
    // If Render fails, try Vercel backend
    return await fetch(`${VERCEL_BACKEND_URL}${path}`);
  } catch (error) {
    console.error(`Error with Render backend, trying Vercel:`, error);
    // If Render throws an error, try Vercel
    return await fetch(`${VERCEL_BACKEND_URL}${path}`);
  }
};

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
  bcom: {
    name: "BCom",
    fullName: "Bachelor of Commerce",
    branches: [
      { id: "general", name: "General" },
      { id: "honors", name: "Honors" }
    ]
  },
  bsc: {
    name: "BSc",
    fullName: "Bachelor of Science",
    branches: [
      { id: "cs", name: "Computer Science" },
      { id: "it", name: "Information Technology" },
      { id: "mathematics", name: "Mathematics" },
      { id: "physics", name: "Physics" }
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
  },
  pharmacy: {
    name: "Pharmacy",
    fullName: "Bachelor of Pharmacy",
    branches: [
      { id: "general", name: "General" }
    ]
  },
  ba: {
    name: "BA",
    fullName: "Bachelor of Arts",
    branches: [
      { id: "general", name: "General" },
      { id: "economics", name: "Economics" },
      { id: "english", name: "English" },
      { id: "history", name: "History" },
      { id: "political_science", name: "Political Science" }
    ]
  },
  bjmc: {
    name: "BJMC",
    fullName: "Bachelor of Journalism & Mass Communication",
    branches: [
      { id: "general", name: "General" }
    ]
  },
  fashion_design: {
    name: "Fashion Design",
    fullName: "Bachelor of Design in Fashion",
    branches: [
      { id: "general", name: "General" },
      { id: "textile", name: "Textile Design" }
    ]
  },
  education: {
    name: "Education",
    fullName: "Bachelor of Education",
    branches: [
      { id: "general", name: "General" }
    ]
  },
  applied_science: {
    name: "Applied Science",
    fullName: "Bachelor of Applied Sciences",
    branches: [
      { id: "general", name: "General" },
      { id: "biotechnology", name: "Biotechnology" },
      { id: "food_tech", name: "Food Technology" }
    ]
  },
  msc: {
    name: "MSc",
    fullName: "Master of Science",
    branches: [
      { id: "physics", name: "Physics" },
      { id: "chemistry", name: "Chemistry" },
      { id: "mathematics", name: "Mathematics" },
      { id: "computer_science", name: "Computer Science" }
    ]
  }
};

// Interface for paper data
interface Paper {
  id: string;
  title: string;
  path: string; // The path to the PDF file, including leading slash
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
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Group papers by subjects
  const groupedPapers = React.useMemo(() => {
    const groups: Record<string, Paper[]> = {};
    searchResults.forEach(paper => {
      const subject = paper.title.split(' - ')[0] || 'Uncategorized';
      if (!groups[subject]) {
        groups[subject] = [];
      }
      groups[subject].push(paper);
    });
    return groups;
  }, [searchResults]);

  // Validate program ID
  const program = programId && programsData[programId as keyof typeof programsData];
  
  // Fetch branches for the selected department/program
  useEffect(() => {
    if (!programId) return;
    
    const fetchBranches = async () => {
      setFetchingOptions(true);
      try {
        // Using the API endpoint described in the documentation
        const response = await fetchWithFallback(`/api/resources/departments/${programId}/branches`);
        
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
        const response = await fetchWithFallback(`/api/resources/departments/${programId}/branches/${selectedBranch}/semesters`);
        
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
        const response = await fetchWithFallback(`/api/resources/departments/${programId}/branches/${selectedBranch}/sessions`);
        
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
    setShowResults(false);
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
    if (!programId || !selectedBranch) {
      setError("Please select a branch first");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      let url = `/api/resources/files?department=${programId}&branch=${selectedBranch}`;
      
      if (selectedSemester) {
        url += `&semester=${selectedSemester}`;
      }
      
      if (selectedSession) {
        url += `&session=${selectedSession}`;
      }

      const response = await fetchWithFallback(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.files && Array.isArray(data.files) && data.files.length > 0) {
        setSearchResults(data.files);
        setShowResults(true);
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
  
  // Function to switch between search form and results
  const toggleView = () => {
    setShowResults(!showResults);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            <Button 
              variant="outline" 
              onClick={() => navigate("/pyq")}
              className="mb-4 sm:mb-0"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Programs
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {program.name} <span className="text-gray-400">Papers</span>
          </h1>
        </div>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
          {program.fullName} Previous Year Question Papers
        </p>
        <Separator className="my-6" />
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant={!showResults ? "default" : "outline"} 
              onClick={() => setShowResults(false)}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Find Papers
            </Button>
            <Button 
              variant={showResults ? "default" : "outline"} 
              onClick={() => setShowResults(true)}
              disabled={searchResults.length === 0}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Results {searchResults.length > 0 && `(${searchResults.length})`}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedBranch.toUpperCase()} • {formatSemester(selectedSemester)} • {selectedSession}
            </p>
          )}
        </div>
        
        {/* Search Form */}
        {!showResults && (
          <Card className="shadow-md border border-gray-200">
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
                  <label htmlFor="branch" className="text-sm font-medium flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
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
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading branches...
                    </p>
                  )}
                </div>
                
                {/* Session Selection */}
                <div className="space-y-2">
                  <label htmlFor="session" className="text-sm font-medium flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
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
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading sessions...
                    </p>
                  )}
                </div>
                
                {/* Semester Selection */}
                <div className="space-y-2">
                  <label htmlFor="semester" className="text-sm font-medium flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
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
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading semesters...
                    </p>
                  )}
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 p-4 rounded-md text-red-600 text-sm border border-red-100">
                  {error}
                </div>
              )}
              
              <Button 
                className="w-full"
                onClick={() => {
                  handleSearch();
                  // Switch to results tab after successful search
                  if (searchResults.length > 0) {
                    setShowResults(true);
                  }
                }}
                disabled={loading || !selectedBranch || !selectedSemester || !selectedSession || fetchingOptions}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Papers
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Results View */}
        {showResults && (
          <>
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Searching for papers...</p>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-6">
                {Object.keys(groupedPapers).length > 1 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.keys(groupedPapers).map(subject => (
                      <div key={subject} className="text-xs px-3 py-1.5 bg-muted rounded-full">
                        {subject}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((paper) => (
                    <PaperCard key={paper.id} paper={paper} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-12 border border-dashed rounded-lg">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-muted">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">No Question Papers Found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn't find any question papers matching your selections.
                  Try a different combination of branch, semester, and session.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Paper card component
function PaperCard({ paper }: { paper: Paper }) {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  
  const handleDownload = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setIsAuthDialogOpen(true);
      return;
    }
    
    // Allow default link behavior if authenticated
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all h-full border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          {paper.title || paper.filename.replace(".pdf", "")}
        </CardTitle>
        <CardDescription className="text-xs">
          {paper.semester.startsWith("semester") 
            ? `Semester ${paper.semester.replace("semester", "").replace("-", "")}` 
            : `Semester ${paper.semester}`} | {paper.session}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-1 pb-3 flex-grow text-xs text-muted-foreground">
        <p className="line-clamp-1">{paper.filename}</p>
      </CardContent>
      <div className="p-3 bg-muted/10 border-t border-gray-100 flex justify-end">
        <a
          href={`${BACKEND_URL}${paper.path}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDownload}
          className="inline-flex items-center px-3 py-1.5 text-xs bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
        >
          <FileText className="h-3 w-3 mr-1.5" />
          Download
        </a>
      </div>
      
      {/* Auth Required Dialog */}
      <AuthRequiredDialog 
        isOpen={isAuthDialogOpen}
        setIsOpen={setIsAuthDialogOpen}
        returnPath={`/pyq/${paper.department}/${paper.branch}`}
      />
    </Card>
  );
}

export default ProgramDetails; 