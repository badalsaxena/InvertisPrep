import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { departments } from "@/data/resources";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronRight, AlertCircle, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Resource {
  id: string;
  title: string;
  type: 'notes' | 'pyq' | 'syllabus';
  path: string;
  semester: number;
  session: string;
}

// Sample resources - replace with actual data from your backend
const sampleResources: Resource[] = [
  {
    id: "os-2023",
    title: "Operating Systems",
    type: "pyq",
    path: "/resources/btech/semester-5/2023-24/pyq/operating-systems.pdf",
    semester: 5,
    session: "2023-24"
  },
  {
    id: "ds-2023",
    title: "Data Structures",
    type: "pyq",
    path: "/resources/btech/semester-3/2023-24/pyq/data-structures.pdf",
    semester: 3,
    session: "2023-24"
  },
  {
    id: "dbms-2023",
    title: "Database Management Systems",
    type: "pyq",
    path: "/resources/btech/semester-4/2023-24/pyq/database-management.pdf",
    semester: 4,
    session: "2023-24"
  }
];

export default function DepartmentView() {
  const { departmentId, branchId } = useParams();
  const location = useLocation();
  const isPYQPage = location.pathname.startsWith('/pyq');
  
  const department = departments.find((d) => d.id === departmentId);
  
  const [selectedBranch, setSelectedBranch] = useState<string>(branchId || "");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("2023-24");

  if (!department) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Department not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const sessions = ["2023-24", "2022-23"];
  const branches = department.branches || [];
  const semesters = selectedBranch
    ? branches.find((b) => b.id === selectedBranch)?.semesters || []
    : department.semesters || [];

  const filteredResources = sampleResources.filter(resource => {
    if (selectedSemester && resource.semester !== parseInt(selectedSemester)) return false;
    if (selectedSession && resource.session !== selectedSession) return false;
    if (isPYQPage && resource.type !== 'pyq') return false;
    return true;
  });

  const handleDownload = (resource: Resource) => {
    // Create the full path including public directory
    const fullPath = `${window.location.origin}${resource.path}`;
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = fullPath;
    link.target = '_blank';
    link.download = `${resource.title}-${resource.session}.pdf`;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <span>{isPYQPage ? 'PYQ' : 'Resources'}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">{department.name}</span>
          {selectedBranch && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-gray-900">
                {branches.find(b => b.id === selectedBranch)?.name}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {department.name} {isPYQPage ? 'Question Papers' : 'Resources'}
          </h1>
          <p className="text-gray-600">{department.description}</p>
        </div>

        {/* Selection Form */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {department.branches && !branchId && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Branch</label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
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
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Semester</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester.toString()}>
                      Semester {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Session</label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger>
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
            </div>
          </div>

          {/* Warning Message */}
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please check your current syllabus before downloading any resources.
            </AlertDescription>
          </Alert>
        </Card>

        {/* Resource Display Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Semester {resource.semester} • {resource.session}
                    </p>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
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

          {filteredResources.length === 0 && selectedSemester && (
            <div className="text-center py-8">
              <p className="text-gray-600">No resources found for the selected filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 