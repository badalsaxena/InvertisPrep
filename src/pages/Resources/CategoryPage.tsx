import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, Download, Eye, FileText, AlertCircle } from "lucide-react";

// Update backend URL to point to localhost
const BACKEND_URL = 'https://invertisprepbackend.vercel.app'; // Local development server

// We'll keep mock data for non-btech categories during development
const mockFiles = {
  "programming": [
    {
      id: "notes/programming/python-basics.pdf",
      name: "Python Programming Basics",
      filename: "python-basics.pdf",
      size: 1800000,
      uploadDate: "2023-10-10T09:15:00Z",
      path: "/resources/notes/programming/python-basics.pdf"
    },
    {
      id: "notes/programming/java-tutorial.pdf",
      name: "Java Complete Tutorial",
      filename: "java-tutorial.pdf",
      size: 5200000,
      uploadDate: "2023-08-18T11:20:00Z",
      path: "/resources/notes/programming/java-tutorial.pdf"
    }
  ],
  "cheatsheets": [
    {
      id: "notes/cheatsheets/git-commands.pdf",
      name: "Git Commands Cheatsheet",
      filename: "git-commands.pdf",
      size: 950000,
      uploadDate: "2023-09-05T16:30:00Z",
      path: "/resources/notes/cheatsheets/git-commands.pdf"
    }
  ]
};

interface FileData {
  id: string;
  name: string;
  filename: string;
  size: number;
  uploadDate: string;
  path: string;
}

// Define interface for the debug attempt data
interface DebugAttempt {
  type: string;
  url: string;
  time: string;
  status?: number;
  statusText?: string;
  responseText?: string;
  success?: boolean;
  error?: string;
}

// Define interface for debug info
interface DebugInfo {
  attempts: DebugAttempt[];
  lastError: string | null;
}

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  useEffect(() => {
    // Format category name for display
    if (categoryId) {
      setCategoryName(formatName(categoryId));
    }
    
    const fetchFiles = async () => {
      setLoading(true);
      setDebugInfo(null);
      
      try {
        // For BTech category, fetch real data from backend
        if (categoryId === "btech") {
          let debugData: DebugInfo = {
            attempts: [],
            lastError: null
          };
          
          // First try to get from the notes API endpoint - this seems to be working from console logs
          try {
            const resourceUrl = `${BACKEND_URL}/api/notes/files?category=${categoryId}`;
            console.log("Fetching from notes API:", resourceUrl);
            debugData.attempts.push({ type: 'notes', url: resourceUrl, time: new Date().toISOString() });
            
            const response = await fetch(resourceUrl);
            
            if (!response.ok) {
              const errorText = await response.text();
              debugData.attempts[0].status = response.status;
              debugData.attempts[0].statusText = response.statusText;
              debugData.attempts[0].responseText = errorText;
              throw new Error(`Could not fetch from notes API: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            debugData.attempts[0].success = true;
            setFiles(data.files || []);
          } catch (resourceError) {
            console.error("Failed to fetch from notes API, trying alternative paths", resourceError);
            debugData.attempts[0].success = false;
            debugData.attempts[0].error = (resourceError as Error).message;
            
            // Try fallback paths
            try {
              // Try direct resources API endpoint as fallback
              const fallbackUrl = `${BACKEND_URL}/api/resources/btech/files`;
              console.log("Trying fallback URL:", fallbackUrl);
              debugData.attempts.push({ type: 'fallback', url: fallbackUrl, time: new Date().toISOString() });
              
              const response = await fetch(fallbackUrl);
              
              if (!response.ok) {
                const errorText = await response.text();
                debugData.attempts[1].status = response.status;
                debugData.attempts[1].statusText = response.statusText;
                debugData.attempts[1].responseText = errorText;
                throw new Error(`Could not fetch from fallback API: ${response.status} ${response.statusText}`);
              }
              
              const data = await response.json();
              debugData.attempts[1].success = true;
              
              // Transform data to match expected format
              const transformedFiles = Array.isArray(data.files) ? data.files.map((file: any) => ({
                id: `btech/${file.filename || file.name}`,
                name: file.name || file.filename?.replace('.pdf', '').replace(/-/g, ' ') || 'Unknown',
                filename: file.filename || `${file.name}.pdf`,
                size: file.size || 0,
                uploadDate: file.uploadDate || new Date().toISOString(),
                path: file.url || file.path || `/api/notes/download/btech/${file.filename || file.name}`
              })) : [];
              
              setFiles(transformedFiles);
            } catch (fallbackError) {
              console.error("Failed to fetch from all sources", fallbackError);
              debugData.attempts[1].success = false;
              debugData.attempts[1].error = (fallbackError as Error).message;
              debugData.lastError = (fallbackError as Error).message;
              setError('Failed to fetch BTech files from any source. Your local server might be using different API paths than expected. Check console for details.');
            }
          }
          
          setDebugInfo(debugData);
        } else {
          // For other categories, use mock data during development
          if (mockFiles[categoryId as keyof typeof mockFiles]) {
            setFiles(mockFiles[categoryId as keyof typeof mockFiles]);
          } else {
            setError("Category not found");
          }
        }
      } catch (err) {
        console.error("Error fetching files:", err);
        setError((err as Error).message || "Failed to load files");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFiles();
  }, [categoryId]);

  const formatName = (id: string): string => {
    if (!id) return "";
    return id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
  };

  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: string): string => {
    if (!date) return 'Unknown date';
    
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = (fileId: string): void => {
    if (categoryId === "btech") {
      // For BTech, use the API endpoint that we know works (notes API)
      window.open(`${BACKEND_URL}/api/notes/download/${fileId}`, '_blank');
    } else {
      // For other categories in development
      alert(`Download triggered for file: ${fileId}`);
    }
  };

  const handleViewPdf = (path: string): void => {
    if (categoryId === "btech" && path.startsWith('http')) {
      // If it's a real URL, open it directly
      window.open(path, '_blank');
    } else if (categoryId === "btech") {
      // For BTech local paths, convert to full URL
      window.open(`${BACKEND_URL}${path}`, '_blank');
    } else {
      // For other categories in development
      alert(`View triggered for path: ${path}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/resources" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
                  Resources
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-500">{categoryName}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{categoryName} Resources</h1>
          <Button variant="outline" onClick={() => navigate('/resources')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to All Resources
          </Button>
        </div>

        {categoryId === "btech" && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700">
                Trying to fetch BTech PDF files from the /api/notes/ endpoint. Based on console logs, this seems to be the working endpoint.
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-indigo-600 rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p>Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
            {debugInfo && categoryId === "btech" && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded-md text-left">
                <details>
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">Debug Information (click to expand)</summary>
                  <div className="mt-2 text-xs overflow-auto max-h-64 text-gray-800">
                    <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                  </div>
                </details>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h3 className="text-sm font-medium text-yellow-800">Troubleshooting Tips:</h3>
                  <ul className="mt-2 text-xs text-yellow-700 list-disc pl-5 space-y-1">
                    <li>Make sure your backend server is running on port 3000</li>
                    <li>Check that you have PDF files in the proper location on your backend</li>
                    <li>Verify the API endpoints in your plan match your actual backend implementation</li>
                    <li>Check browser network tab to see the exact API calls and responses</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : files.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                        {file.name}
                      </div>
                    </TableCell>
                    <TableCell>{formatBytes(file.size)}</TableCell>
                    <TableCell>{formatDate(file.uploadDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewPdf(file.path)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleDownload(file.id)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <FileText className="h-16 w-16 mx-auto text-gray-400" />
            <p className="mt-4 text-lg">No files found in {categoryName}</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/resources')}
              className="mt-4"
            >
              Back to Resources
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 