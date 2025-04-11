import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Book, FileQuestion, Search, Filter } from "lucide-react";

// Dummy data for demonstration
const resources = [
  { id: 1, type: "pyq", title: "Data Structures Final Exam 2023", semester: "3rd", branch: "CSE", year: "2023" },
  { id: 2, type: "pyq", title: "Database Management Systems Mid Term 2023", semester: "4th", branch: "CSE", year: "2023" },
  { id: 3, type: "notes", title: "Complete Operating Systems Notes", semester: "5th", branch: "CSE", year: "2023" },
  { id: 4, type: "notes", title: "Computer Networks Study Material", semester: "6th", branch: "CSE", year: "2023" },
  { id: 5, type: "syllabus", title: "B.Tech CSE Complete Syllabus", semester: "All", branch: "CSE", year: "2023" },
  { id: 6, type: "syllabus", title: "B.Tech ECE Complete Syllabus", semester: "All", branch: "ECE", year: "2023" },
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter resources based on search query and active tab
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || resource.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Academic Resources
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Access previous year question papers, notes, and syllabus details all in one place.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search resources..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 sm:w-[500px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pyq">PYQs</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div 
              key={resource.id} 
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {resource.type === "pyq" && (
                    <FileQuestion className="h-8 w-8 text-indigo-600 flex-shrink-0" />
                  )}
                  {resource.type === "notes" && (
                    <FileText className="h-8 w-8 text-indigo-600 flex-shrink-0" />
                  )}
                  {resource.type === "syllabus" && (
                    <Book className="h-8 w-8 text-indigo-600 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {resource.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs">
                        {resource.semester} Semester
                      </span>
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs">
                        {resource.branch}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs">
                        {resource.year}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No resources found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
} 