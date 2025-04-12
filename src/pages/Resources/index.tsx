import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Filter } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  semester: string;
  department: string;
  year: string;
  type: 'PYQs' | 'Notes' | 'Syllabus';
}

const sampleResources: Resource[] = [
  {
    id: "1",
    title: "Data Structures Final Exam 2023",
    semester: "3rd Semester",
    department: "CSE",
    year: "2023",
    type: "PYQs"
  },
  {
    id: "2",
    title: "Database Management Systems Mid Term 2023",
    semester: "4th Semester",
    department: "CSE",
    year: "2023",
    type: "PYQs"
  },
  {
    id: "3",
    title: "Complete Operating Systems Notes",
    semester: "5th Semester",
    department: "CSE",
    year: "2023",
    type: "Notes"
  },
  {
    id: "4",
    title: "Computer Networks Study Material",
    semester: "6th Semester",
    department: "CSE",
    year: "2023",
    type: "Notes"
  },
  {
    id: "5",
    title: "B.Tech CSE Complete Syllabus",
    semester: "All",
    department: "CSE",
    year: "2023",
    type: "Syllabus"
  },
  {
    id: "6",
    title: "B.Tech ECE Complete Syllabus",
    semester: "All",
    department: "ECE",
    year: "2023",
    type: "Syllabus"
  }
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'All' | 'PYQs' | 'Notes' | 'Syllabus'>('All');

  const filteredResources = sampleResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || resource.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Academic Resources
        </h1>
        <p className="text-lg text-gray-600">
          Access previous year question papers, notes, and syllabus details all in one place.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex gap-2 border-b pb-2">
          {(['All', 'PYQs', 'Notes', 'Syllabus'] as const).map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "ghost"}
              onClick={() => setActiveFilter(filter)}
              className="rounded-full"
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {resource.type === 'PYQs' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {resource.type === 'Notes' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                  {resource.type === 'Syllabus' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">{resource.semester}</span>
                    <span className="text-sm text-gray-600">{resource.department}</span>
                    <span className="text-sm text-gray-600">{resource.year}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 