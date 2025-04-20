import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, Download, Eye, FileText } from "lucide-react";

// Define types for file data
interface FileData {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  path: string;
}

export default function FilesPage() {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");

  useEffect(() => {
    // Format names for display
    if (categoryId) setCategoryName(formatName(categoryId));
    if (subcategoryId) setSubcategoryName(formatName(subcategoryId));
    
    // Fetch files
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/resources/files?category=${categoryId}&subcategory=${subcategoryId}`);
        if (!response.ok) throw new Error('Failed to fetch files');
        const data = await response.json();
        setFiles(data.files);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [categoryId, subcategoryId]);

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
    window.open(`/api/resources/download/${fileId}`, '_blank');
  };

  const handleViewPdf = (path: string): void => {
    window.open(path, '_blank');
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
                  <Link to={`/resources/${categoryId}`} className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                    {categoryName}
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-500">{subcategoryName}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{subcategoryName}</h1>
          <Button variant="outline" onClick={() => navigate(`/resources/${categoryId}`)}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to {categoryName}
          </Button>
        </div>

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
            <p className="mt-4 text-lg">No files found in this subcategory</p>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/resources/${categoryId}`)}
              className="mt-4"
            >
              Back to {categoryName}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 