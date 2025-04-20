import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, FileText, Search, BookOpen, Code, FileCode } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for initial development - replace with API call later
const mockCategories = [
  {
    id: "btech",
    name: "BTech",
    description: "Engineering study materials and notes",
    icon: <BookOpen className="h-6 w-6 text-indigo-600" />,
    path: "/resources/btech"
  },
  {
    id: "programming",
    name: "Programming",
    description: "Programming tutorials and resources",
    icon: <Code className="h-6 w-6 text-emerald-600" />,
    path: "/resources/programming"
  },
  {
    id: "cheatsheets",
    name: "Cheatsheets",
    description: "Quick reference materials",
    icon: <FileCode className="h-6 w-6 text-purple-600" />,
    path: "/resources/cheatsheets"
  }
];

export default function Resources() {
  const [categories, setCategories] = useState(mockCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Will replace this with actual API call when backend is ready
  useEffect(() => {
    // Mock API call for now
    // const fetchCategories = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await fetch('/api/resources/categories');
    //     if (!response.ok) throw new Error('Failed to fetch categories');
    //     const data = await response.json();
    //     setCategories(data.categories);
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Academic Resources
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Access notes, study materials, and other academic resources all in one place.
          </p>
          
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search resources..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
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
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Link key={category.id} to={category.path} className="no-underline">
                <Card className="h-full transition-all hover:shadow-md hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {category.icon}
                      </div>
                    </div>
                    <CardTitle className="mt-4">{category.name}</CardTitle>
                    <CardDescription>
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Explore Resources
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <FileText className="h-16 w-16 mx-auto text-gray-400" />
            <p className="mt-4 text-lg">No categories match your search</p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 