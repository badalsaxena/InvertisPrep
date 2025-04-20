import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, Download, Eye, FileText, AlertCircle } from "lucide-react";

// Set backend URL based on environment
// When running locally (dev mode), use localhost, otherwise use production
const isDevelopment = window.location.hostname === 'localhost';
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:3000'
  : 'https://invertisprepbackend.vercel.app';

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

interface FileData {
  id: string;
  name: string;
  filename: string;
  size: number;
  uploadDate: string;
  path: string;
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
        // Special handling for cheatsheets category (API uses singular form)
        const apiCategoryId = categoryId === "cheatsheets" ? "cheatsheet" : categoryId;
        
        console.log(`Fetching files for category: ${categoryId} from ${BACKEND_URL} (API parameter: ${apiCategoryId})`);
        let debugData: DebugInfo = {
          attempts: [],
          lastError: null
        };
        
        // Try to get from the notes API endpoint first
        try {
          const resourceUrl = `${BACKEND_URL}/api/notes/files?category=${apiCategoryId}`;
          console.log(`Trying primary API endpoint: ${resourceUrl}`);
          debugData.attempts.push({ type: 'notes', url: resourceUrl, time: new Date().toISOString() });
          
          const response = await fetch(resourceUrl);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Primary API call failed with status: ${response.status} ${response.statusText}`);
            console.error(`Response text: ${errorText}`);
            debugData.attempts[0].status = response.status;
            debugData.attempts[0].statusText = response.statusText;
            debugData.attempts[0].responseText = errorText;
            throw new Error(`Could not fetch from notes API: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log(`Primary API returned data:`, data);
          debugData.attempts[0].success = true;
          setFiles(data.files || []);
        } catch (resourceError) {
          console.error(`Failed to fetch ${categoryId} from notes API:`, resourceError);
          debugData.attempts[0].success = false;
          debugData.attempts[0].error = (resourceError as Error).message;
          
          // Try fallback paths
          try {
            // Try direct resources API endpoint as fallback
            const fallbackUrl = `${BACKEND_URL}/api/resources/${apiCategoryId}/files`;
            console.log(`Trying fallback URL: ${fallbackUrl}`);
            debugData.attempts.push({ type: 'fallback', url: fallbackUrl, time: new Date().toISOString() });
            
            const response = await fetch(fallbackUrl);
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Fallback API call failed with status: ${response.status} ${response.statusText}`);
              console.error(`Response text: ${errorText}`);
              debugData.attempts[1].status = response.status;
              debugData.attempts[1].statusText = response.statusText;
              debugData.attempts[1].responseText = errorText;
              throw new Error(`Could not fetch from fallback API: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`Fallback API returned data:`, data);
            debugData.attempts[1].success = true;
            
            // Transform data to match expected format
            const transformedFiles = Array.isArray(data.files) ? data.files.map((file: any) => ({
              id: `${apiCategoryId}/${file.filename || file.name}`,
              name: file.name || file.filename?.replace('.pdf', '').replace(/-/g, ' ') || 'Unknown',
              filename: file.filename || `${file.name}.pdf`,
              size: file.size || 0,
              uploadDate: file.uploadDate || new Date().toISOString(),
              path: file.url || file.path || `/api/notes/download/${apiCategoryId}/${file.filename || file.name}`
            })) : [];
            
            setFiles(transformedFiles);
          } catch (fallbackError) {
            console.error(`Failed to fetch ${categoryId} files from all sources:`, fallbackError);
            debugData.attempts[1].success = false;
            debugData.attempts[1].error = (fallbackError as Error).message;
            debugData.lastError = (fallbackError as Error).message;
            setError(`Failed to fetch ${categoryName} files from any source. Check console for details.`);
          }
        }
        
        setDebugInfo(debugData);
      } catch (err) {
        console.error(`General error fetching files for ${categoryId}:`, err);
        setError((err as Error).message || "Failed to load files");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFiles();
  }, [categoryId, categoryName]);

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
    // Extract just the file part, not the category prefix
    const filePart = fileId.includes('/') ? fileId.split('/')[1] : fileId;
    
    // Special handling for cheatsheets category (API uses singular form)
    const apiCategoryId = categoryId === "cheatsheets" ? "cheatsheet" : categoryId;
    
    // Use the API endpoint for all categories
    window.open(`${BACKEND_URL}/api/notes/download/${apiCategoryId}/${filePart}`, '_blank');
  };

  const handleViewPdf = (path: string): void => {
    if (path.startsWith('http')) {
      // If it's a real URL, open it directly
      window.open(path, '_blank');
    } else {
      // For local paths, convert to full URL
      window.open(`${BACKEND_URL}${path}`, '_blank');
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

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-indigo-600 rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg font-medium mb-2">Error: {error}</p>
            <p className="text-gray-600 mb-4">
              Backend URL: {BACKEND_URL}
              {isDevelopment && (
                <span className="ml-2 text-yellow-600 font-semibold">(Development Mode)</span>
              )}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-2">
              Try Again
            </Button>
            
            {debugInfo && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded-md text-left max-w-3xl mx-auto">
                <details>
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 pb-2">
                    Debug Information (click to expand)
                  </summary>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">API Request Attempts:</h3>
                      {debugInfo.attempts.map((attempt, index) => (
                        <div key={index} className="mt-2 p-3 bg-white border rounded-md">
                          <p className="font-medium text-sm">
                            Attempt {index + 1}: {attempt.type} API
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${attempt.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {attempt.success ? 'Success' : 'Failed'}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">URL: {attempt.url}</p>
                          <p className="text-xs text-gray-500">Time: {new Date(attempt.time).toLocaleTimeString()}</p>
                          
                          {!attempt.success && (
                            <div className="mt-2 p-2 bg-red-50 rounded-md text-xs">
                              <p className="text-red-700">Status: {attempt.status || 'N/A'} {attempt.statusText || ''}</p>
                              {attempt.error && <p className="text-red-700 mt-1">Error: {attempt.error}</p>}
                              {attempt.responseText && (
                                <details className="mt-1">
                                  <summary className="cursor-pointer text-red-700">Response Text</summary>
                                  <pre className="mt-1 p-1 bg-red-100 rounded text-red-800 overflow-auto text-xs max-h-32">
                                    {attempt.responseText}
                                  </pre>
                                </details>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <h3 className="text-sm font-medium text-yellow-800">Troubleshooting Tips:</h3>
                      <ul className="mt-2 text-xs text-yellow-700 list-disc pl-5 space-y-1">
                        <li>{isDevelopment ? 
                          "Make sure your backend server is running on localhost:3000" : 
                          "Check that the backend server is online and accessible"}</li>
                        <li>Check that you have PDF files for the {categoryName} category on your backend</li>
                        <li>Verify that the API endpoints match your backend implementation</li>
                        <li>Check browser network tab to see the exact API calls and responses</li>
                        {isDevelopment && <li>Try the production site to verify if it's a local environment issue</li>}
                      </ul>
                    </div>
                  </div>
                </details>
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