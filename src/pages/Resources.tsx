import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, FileText, Search, BookOpen, Code, FileCode, FileSpreadsheet, BookMarked } from "lucide-react";

// Mock data for initial development - replace with API call later
const mockCategories = [
  {
    id: "syllabus",
    name: "Syllabus",
    description: "Course syllabi for all departments",
    icon: <BookMarked className="h-6 w-6 text-red-600" />,
    path: "/resources/syllabus",
    featured: true
  },
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

  // Get featured category (syllabus)
  const featuredCategory = categories.find(category => category.featured);
  // Get regular categories
  const regularCategories = categories.filter(category => !category.featured);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Academic Resources
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Access notes, study materials, and other academic resources all in one place.
          </p>
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
        ) : (
          <>
            {/* Featured Syllabus Card */}
            {featuredCategory && (
              <div className="mb-10">
                <Link to={featuredCategory.path} className="no-underline">
                  <Card className="overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-all">
                    <div className="relative">
                      <div className="absolute top-0 right-0 left-0 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 z-0"></div>
                      <div className="relative z-10 pt-4 px-6">
                        <div className="bg-white p-3 rounded-full shadow-sm border border-blue-100 inline-block">
                          {featuredCategory.icon}
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pt-2 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-800">{featuredCategory.name}</CardTitle>
                          <CardDescription className="text-gray-600 mt-1">
                            Course syllabi for all departments
                          </CardDescription>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm w-full sm:w-auto">
                          Browse Syllabus
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            )}

            {/* Regular Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularCategories.map((category) => (
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
          </>
        )}
      </div>
    </div>
  );
} 