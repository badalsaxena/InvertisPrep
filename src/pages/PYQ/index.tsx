import React from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, ChevronRight, BookOpen, BookMarked } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Program data with interface
export interface Program {
  id: string;
  name: string;
  fullName: string;
  description: string;
  subjects?: string[];
}

// Subject mappings for each program
const programSubjects: Record<string, string[]> = {
  "btech": [
    "Data Structures & Algorithms", 
    "Computer Networks", 
    "Operating Systems", 
    "Database Management Systems", 
    "Object Oriented Programming",
    "Computer Organization",
    "Software Engineering",
    "Web Development",
    "Artificial Intelligence"
  ],
  "bca": [
    "Programming Fundamentals",
    "Data Structures",
    "Database Systems",
    "Computer Networks",
    "Operating Systems",
    "Web Technologies",
    "Software Engineering"
  ],
  "bcom": [
    "Financial Accounting",
    "Business Economics",
    "Business Law",
    "Corporate Accounting",
    "Cost Accounting",
    "Income Tax",
    "Auditing"
  ],
  "bsc": [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Computer Science",
    "Statistics",
    "Environmental Science"
  ],
  "mca": [
    "Advanced Data Structures",
    "Advanced Database Systems",
    "Advanced Computer Networks",
    "Machine Learning",
    "Cloud Computing",
    "Mobile Application Development",
    "Data Mining"
  ],
  "mtech": [
    "Advanced Algorithms",
    "Advanced Computer Architecture",
    "Distributed Systems",
    "Information Security",
    "Wireless Networks",
    "Image Processing",
    "Advanced Software Engineering"
  ],
  "bba": [
    "Principles of Management",
    "Financial Management",
    "Marketing Management",
    "Human Resource Management",
    "Operations Management",
    "Business Ethics",
    "Strategic Management"
  ],
  "mba": [
    "Advanced Financial Management",
    "Marketing Research",
    "Organizational Behavior",
    "Business Analytics",
    "Project Management",
    "International Business",
    "Entrepreneurship"
  ],
  "pharmacy": [
    "Pharmaceutical Chemistry",
    "Pharmacology",
    "Pharmaceutics",
    "Pharmacognosy",
    "Clinical Pharmacy",
    "Pharmacotherapeutics",
    "Pharmaceutical Analysis"
  ],
  "ba": [
    "English Literature",
    "History",
    "Political Science",
    "Sociology",
    "Economics",
    "Psychology",
    "Philosophy"
  ],
  "bjmc": [
    "Introduction to Journalism",
    "Media Ethics",
    "Digital Media Production",
    "Public Relations",
    "Advertising",
    "Television & Radio Journalism",
    "Media Law"
  ],
  "fashion_design": [
    "Fashion Illustration",
    "Textile Design",
    "Garment Construction",
    "Fashion Marketing",
    "Fashion Merchandising",
    "Computer-Aided Design",
    "Fashion Portfolio Development"
  ],
  "education": [
    "Educational Psychology",
    "Teaching Methodology",
    "Educational Technology",
    "Curriculum Development",
    "Classroom Management",
    "Educational Assessment",
    "Inclusive Education"
  ],
  "applied_science": [
    "Applied Mathematics",
    "Applied Physics",
    "Applied Chemistry",
    "Biotechnology",
    "Material Science",
    "Environmental Science",
    "Food Technology"
  ],
  "msc": [
    "Advanced Analytical Techniques",
    "Research Methodology",
    "Quantum Mechanics",
    "Molecular Biology",
    "Organic Chemistry",
    "Differential Equations",
    "Bioinformatics"
  ]
};

// Program data
export const programs: Program[] = [
  {
    id: "btech",
    name: "BTech",
    fullName: "Bachelor of Technology",
    description: "4-year undergraduate program focusing on engineering",
    subjects: programSubjects["btech"]
  },
  {
    id: "bca",
    name: "BCA",
    fullName: "Bachelor of Computer Applications",
    description: "3-year undergraduate program focusing on computer applications",
    subjects: programSubjects["bca"]
  },
  {
    id: "bcom",
    name: "BCom",
    fullName: "Bachelor of Commerce",
    description: "3-year undergraduate program focusing on commerce",
    subjects: programSubjects["bcom"]
  },
  {
    id: "bsc",
    name: "BSc",
    fullName: "Bachelor of Science",
    description: "3-year undergraduate program focusing on science",
    subjects: programSubjects["bsc"]
  },
  {
    id: "mca",
    name: "MCA",
    fullName: "Master of Computer Applications",
    description: "2-year postgraduate program focusing on computer applications",
    subjects: programSubjects["mca"]
  },
  {
    id: "mtech",
    name: "MTech",
    fullName: "Master of Technology",
    description: "2-year postgraduate program focusing on advanced engineering",
    subjects: programSubjects["mtech"]
  },
  {
    id: "bba",
    name: "BBA",
    fullName: "Bachelor of Business Administration",
    description: "3-year undergraduate program focusing on business management",
    subjects: programSubjects["bba"]
  },
  {
    id: "mba",
    name: "MBA",
    fullName: "Master of Business Administration",
    description: "2-year postgraduate program focusing on advanced business management",
    subjects: programSubjects["mba"]
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    fullName: "Bachelor of Pharmacy",
    description: "4-year undergraduate program focusing on pharmaceutical sciences",
    subjects: programSubjects["pharmacy"]
  },
  
  {
    id: "bjmc",
    name: "BJMC",
    fullName: "Bachelor of Journalism & Mass Communication",
    description: "3-year undergraduate program focusing on media and communication",
    subjects: programSubjects["bjmc"]
  },
  {
    id: "fashiondesign",
    name: "Fashion Design",
    fullName: "Bachelor of Design in Fashion",
    description: "4-year undergraduate program focusing on fashion and textile design",
    subjects: programSubjects["fashiondesign"]
  },
  {
    id: "law",
    name: "Law",
    fullName: "Bachelor of Law",
    description: "3-year undergraduate program focusing on legal studies",
    subjects: programSubjects["law"]
  },
  {
    id: "education",
    name: "Education",
    fullName: "Bachelor of Education",
    description: "2-year program preparing students for teaching careers",
    subjects: programSubjects["education"]
  },
  {
    id: "appliedscienceandhumanities",
    name: "Applied Science",
    fullName: "Bachelor of Applied Sciences",
    description: "3-year program focusing on practical applications of scientific principles",
    subjects: programSubjects["appliedscienceandhumanities"]
  },
  {
    id: "msc",
    name: "MSc",
    fullName: "Master of Science",
    description: "2-year postgraduate program with advanced scientific specialization",
    subjects: programSubjects["msc"]
  }
];

function PYQPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Previous Year Question Papers
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Access previous year question papers for all programs and branches.
          </p>
        </div>
        
        {/* Featured Syllabus Card */}
        <div className="mb-10">
          <Link to="/resources/syllabus" className="no-underline">
            <Card className="overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-all">
              <div className="relative">
                <div className="absolute top-0 right-0 left-0 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 z-0"></div>
                <div className="relative z-10 pt-4 px-6">
                  <div className="bg-white p-3 rounded-full shadow-sm border border-blue-100 inline-block">
                    <BookMarked className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </div>
              <CardHeader className="pt-2 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-800">Syllabus</CardTitle>
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
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 text-sm mb-8">
          <p><strong>Note:</strong> Before downloading any previous year papers, please check your current syllabus.</p>
        </div>
        
        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {programs.map((program) => (
            <Link to={`/pyq/${program.id}`} key={program.id} className="no-underline">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold">
                        {program.name}
                      </CardTitle>
                      <CardDescription>
                        {program.fullName}
                      </CardDescription>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground">
                    {program.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between group">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Question Papers
                    </span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PYQPage; 