import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertCircle, 
  FileText, 
  Download, 
  Loader2, 
  Search,
  ArrowRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  getDepartments, 
  getBranches,
  getSemesters,
  getSessions,
  getFiles,
} from "@/services/resourceService";
import { Department, Branch, PDFResource } from "@/data/resources";

// Define the steps in our wizard
type WizardStep = 'department' | 'branch' | 'semester' | 'session' | 'resources';

export default function DepartmentWizard() {
  // State for the wizard
  const [currentStep, setCurrentStep] = useState<WizardStep>('department');
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  
  // Data state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  
  // Resources state
  const [resources, setResources] = useState<PDFResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const data = await getDepartments();
        console.log('Fetched Departments:', data);
        setDepartments(data);
        setError(null);
      } catch (err) {
        setError("Failed to load departments. Please try again later.");
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch branches when department is selected
  useEffect(() => {
    if (selectedDepartment) {
      const fetchBranches = async () => {
        setLoading(true);
        try {
          const data = await getBranches(selectedDepartment);
          setBranches(data);
          setError(null);
        } catch (err) {
          setError("Failed to load branches. Please try again later.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchBranches();
    }
  }, [selectedDepartment]);

  // Fetch semesters when branch is selected
  useEffect(() => {
    if (selectedDepartment && selectedBranch) {
      const fetchSemesters = async () => {
        setLoading(true);
        try {
          const data = await getSemesters(selectedDepartment, selectedBranch);
          setSemesters(data);
          setError(null);
        } catch (err) {
          setError("Failed to load semesters. Please try again later.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchSemesters();
    }
  }, [selectedDepartment, selectedBranch]);

  // Fetch sessions when branch is selected
  useEffect(() => {
    if (selectedDepartment && selectedBranch) {
      const fetchSessions = async () => {
        setLoading(true);
        try {
          const data = await getSessions(selectedDepartment, selectedBranch);
          setSessions(data);
          setError(null);
        } catch (err) {
          setError("Failed to load sessions. Please try again later.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchSessions();
    }
  }, [selectedDepartment, selectedBranch]);

  // Move to the next step in the wizard
  const goToNextStep = () => {
    switch (currentStep) {
      case 'department':
        setCurrentStep('branch');
        break;
      case 'branch':
        setCurrentStep('semester');
        break;
      case 'semester':
        setCurrentStep('session');
        break;
      case 'session':
        setCurrentStep('resources');
        fetchResources();
        break;
    }
  };

  // Go back to previous step
  const goToPreviousStep = () => {
    switch (currentStep) {
      case 'branch':
        setCurrentStep('department');
        setSelectedBranch("");
        break;
      case 'semester':
        setCurrentStep('branch');
        setSelectedSemester("");
        break;
      case 'session':
        setCurrentStep('semester');
        setSelectedSession("");
        break;
      case 'resources':
        setCurrentStep('session');
        break;
    }
  };

  // Fetch resources based on selected criteria
  const fetchResources = async () => {
    if (
      !selectedDepartment || 
      !selectedBranch || 
      !selectedSemester || 
      !selectedSession
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const files = await getFiles(
        selectedDepartment,
        selectedBranch,
        selectedSemester,
        selectedSession
      );
      
      setResources(files);
    } catch (err) {
      setError("Failed to load resources. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle downloading a file
  const handleDownload = (resource: PDFResource) => {
    try {
      // Construct the correct path to the file
      const fullPath = `https://invertisprepbackend.vercel.app${resource.path}`;
      
      // Create a download link
      const link = document.createElement('a');
      link.href = fullPath;
      link.setAttribute('download', (resource.fileName || resource.filename || `file-${resource.id}.pdf`));
      link.setAttribute('target', '_blank');
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`Downloading file: ${resource.fileName || resource.filename || resource.id}`);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Filter resources by search query
  const filteredResources = resources.filter(resource => {
    if (searchQuery) {
      const titleText = resource.subjectName || resource.title || resource.fileName || '';
      return titleText.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Render the appropriate step content
  const renderStepContent = () => {
    if (loading && currentStep !== 'resources') {
      return (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      );
    }

    if (error && currentStep !== 'resources') {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    switch (currentStep) {
      case 'department':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Select Department</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map(dept => (
                <Card 
                  key={dept.id}
                  className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                    selectedDepartment === dept.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedDepartment(dept.id)}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-medium">{dept.name}</h3>
                      <p className="text-sm text-gray-600">{dept.description}</p>
                    </div>
                    {selectedDepartment === dept.id && (
                      <Check className="ml-auto text-blue-500 h-5 w-5" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <Button 
                onClick={goToNextStep}
                disabled={!selectedDepartment}
                className="flex items-center gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 'branch':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Select Branch</h2>
            {branches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branches.map(branch => (
                  <Card 
                    key={branch.id}
                    className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                      selectedBranch === branch.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedBranch(branch.id)}
                  >
                    <div className="flex items-center">
                      <h3 className="font-medium">{branch.name}</h3>
                      {selectedBranch === branch.id && (
                        <Check className="ml-auto text-blue-500 h-5 w-5" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No branches found for this department.
                </AlertDescription>
              </Alert>
            )}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={goToPreviousStep}>
                Back
              </Button>
              <Button 
                onClick={goToNextStep}
                disabled={!selectedBranch}
                className="flex items-center gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 'semester':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Select Semester</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {semesters.map(semester => (
                <Card 
                  key={semester}
                  className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                    selectedSemester === semester ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedSemester(semester)}
                >
                  <div className="flex items-center justify-center">
                    <h3 className="font-medium text-center">Semester {semester}</h3>
                    {selectedSemester === semester && (
                      <Check className="ml-2 text-blue-500 h-5 w-5" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={goToPreviousStep}>
                Back
              </Button>
              <Button 
                onClick={goToNextStep}
                disabled={!selectedSemester}
                className="flex items-center gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 'session':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Select Session</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sessions.map(session => (
                <Card 
                  key={session}
                  className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                    selectedSession === session ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center justify-center">
                    <h3 className="font-medium text-center">{session}</h3>
                    {selectedSession === session && (
                      <Check className="ml-2 text-blue-500 h-5 w-5" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={goToPreviousStep}>
                Back
              </Button>
              <Button 
                onClick={goToNextStep}
                disabled={!selectedSession}
                className="flex items-center gap-2"
              >
                View Resources <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 'resources':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Resources</h2>
              <Button variant="outline" onClick={goToPreviousStep}>
                Change Selection
              </Button>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium">Selected Options:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                <div className="text-sm">
                  <span className="text-gray-600">Department:</span> {departments.find(d => d.id === selectedDepartment)?.name}
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Branch:</span> {branches.find(b => b.id === selectedBranch)?.name}
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Semester:</span> {selectedSemester}
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Session:</span> {selectedSession}
                </div>
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search files..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Resource Display */}
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                <p className="text-gray-600">Loading resources...</p>
              </div>
            ) : (
              <>
                {filteredResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResources.map((resource) => (
                      <Card key={resource.id} className="p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 break-words">
                              {resource.subjectName || resource.title || resource.fileName || resource.filename || 'Untitled Document'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              Semester {resource.semester} • {resource.session}
                            </p>
                            <Button 
                              variant="default" 
                              className="flex items-center gap-2 w-full justify-center"
                              onClick={() => handleDownload(resource)}
                            >
                              <Download className="h-4 w-4" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      {searchQuery 
                        ? "No files matching your search query." 
                        : "No resources found for the selected filters."}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        );
    }
  };
  
  // Render the progress steps
  const renderProgressSteps = () => {
    const steps: { name: string; step: WizardStep }[] = [
      { name: 'Department', step: 'department' },
      { name: 'Branch', step: 'branch' },
      { name: 'Semester', step: 'semester' },
      { name: 'Session', step: 'session' },
      { name: 'Resources', step: 'resources' }
    ];
    
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full 
                ${currentStep === step.step 
                  ? 'bg-blue-600 text-white' 
                  : index < steps.findIndex(s => s.step === currentStep)
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-200 text-gray-500'
                }
              `}>
                {index + 1}
              </div>
              <span className="hidden sm:block ml-2 text-sm font-medium text-gray-600">
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className="hidden sm:block w-12 h-1 mx-2 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Previous Year Question Papers
        </h1>
        <p className="text-gray-600 mb-8">
          Browse and download question papers from previous years to help with your exam preparation.
        </p>
        
        {renderProgressSteps()}
        
        <Card className="p-6">
          {renderStepContent()}
        </Card>
      </div>
    </div>
  );
} 