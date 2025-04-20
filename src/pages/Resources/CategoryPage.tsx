import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, ChevronLeft, FileText } from "lucide-react";

// Define types for subcategory data
interface Subcategory {
  id: string;
  name: string;
  fileCount: number;
}

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    // Format category name for display
    if (categoryId) {
      setCategoryName(formatName(categoryId));
    }
    
    // Fetch subcategories
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/resources/categories/${categoryId}/subcategories`);
        if (!response.ok) throw new Error('Failed to fetch subcategories');
        const data = await response.json();
        setSubcategories(data.subcategories);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  const formatName = (id: string): string => {
    if (!id) return "";
    return id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
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
          <div className="text-center py-12 text-red-600">
            <p>Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : subcategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((subcategory) => (
              <Link key={subcategory.id} to={`/resources/${categoryId}/${subcategory.id}`} className="no-underline">
                <Card className="h-full transition-all hover:shadow-md hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <Folder className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <CardTitle className="mt-4">{subcategory.name}</CardTitle>
                    <CardDescription>
                      {subcategory.fileCount} {subcategory.fileCount === 1 ? 'file' : 'files'} available
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Browse Files
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <FileText className="h-16 w-16 mx-auto text-gray-400" />
            <p className="mt-4 text-lg">No subcategories found for {categoryName}</p>
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